// Server-only chat core: request validation, provider selection and fallback.
// Kept free of SDK imports so it can be unit-tested in isolation.

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
  serviceType?: string;
  userProfile?: {
    industry?: string;
    companySize?: string;
    securityConcerns?: string[];
  };
}

export const LIMITS = {
  maxMessageChars: 2000,
  maxHistoryMessages: 10,
  maxHistoryChars: 4000,
  maxProfileFieldChars: 100,
  maxConcerns: 10
} as const;

const SERVICE_TYPES = new Set(['security-guards', 'surveillance', 'virtual-guard', 'it-support']);

function clip(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

export type ValidationResult = { ok: true; value: ChatRequest } | { ok: false; error: string };

export function validateChatRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid JSON body' };
  const raw = body as Record<string, unknown>;

  if (typeof raw.message !== 'string' || !raw.message.trim()) {
    return { ok: false, error: 'message is required' };
  }
  if (raw.message.length > LIMITS.maxMessageChars) {
    return { ok: false, error: `message must be ${LIMITS.maxMessageChars} characters or fewer` };
  }

  const history: ChatMessage[] = [];
  if (Array.isArray(raw.history)) {
    let budget = LIMITS.maxHistoryChars;
    // Walk newest-first so the most recent context survives the budget.
    for (const item of raw.history.slice(-LIMITS.maxHistoryMessages).reverse()) {
      if (!item || typeof item !== 'object') continue;
      const { role, content } = item as Record<string, unknown>;
      if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string' || !content) continue;
      if (content.length > budget) break;
      budget -= content.length;
      history.unshift({ role, content });
    }
  }

  const serviceType = typeof raw.serviceType === 'string' && SERVICE_TYPES.has(raw.serviceType)
    ? raw.serviceType
    : undefined;

  let userProfile: ChatRequest['userProfile'];
  if (raw.userProfile && typeof raw.userProfile === 'object') {
    const p = raw.userProfile as Record<string, unknown>;
    const concerns = Array.isArray(p.securityConcerns)
      ? p.securityConcerns
          .map((c) => clip(c, LIMITS.maxProfileFieldChars))
          .filter((c): c is string => Boolean(c))
          .slice(0, LIMITS.maxConcerns)
      : undefined;
    userProfile = {
      industry: clip(p.industry, LIMITS.maxProfileFieldChars),
      companySize: clip(p.companySize, LIMITS.maxProfileFieldChars),
      securityConcerns: concerns?.length ? concerns : undefined
    };
  }

  return { ok: true, value: { message: raw.message.trim(), history, serviceType, userProfile } };
}

// ---------------------------------------------------------------------------
// Provider plan
// ---------------------------------------------------------------------------

export type ProviderName = 'vercel-ai-gateway' | 'nvidia-nim' | 'openrouter';

export interface Attempt {
  provider: ProviderName;
  model: string;
}

// Tier 1 — Vercel AI Gateway. DeepSeek first (Orville's pick).
export const DEFAULT_GATEWAY_MODELS = ['deepseek/deepseek-v4-flash', 'openai/gpt-4o-mini'];
// Tier 2 — NVIDIA NIM (integrate.api.nvidia.com), Nemotron first.
// Ids verified against https://integrate.api.nvidia.com/v1/models (2026-11-12).
export const DEFAULT_NVIDIA_MODELS = [
  'nvidia/nemotron-3.5-lightning-30b-a3b',
  'nvidia/nemotron-3-super-120b-a12b',
  'openai/gpt-oss-20b'
];
// Tier 3 — OpenRouter free models, Nemotron first. OpenRouter lists no ":free"
// DeepSeek model, which is why DeepSeek runs through the AI Gateway.
export const DEFAULT_OPENROUTER_FREE_MODELS = [
  'nvidia/nemotron-3.5-lightning:free',
  'google/gemma-4-31b-it:free',
  'openrouter/free'
];

export function parseModelList(value: string | undefined, fallback: string[]): string[] {
  if (!value) return fallback;
  const list = value.split(',').map((m) => m.trim()).filter(Boolean);
  return list.length ? list : fallback;
}

export type Env = Record<string, string | undefined>;

/** Gateway auth works with an explicit key, or with Vercel OIDC when deployed on Vercel. */
export function gatewayAvailable(env: Env): boolean {
  return Boolean(env.AI_GATEWAY_API_KEY || env.VERCEL_OIDC_TOKEN || env.VERCEL);
}

export function buildAttemptPlan(env: Env): Attempt[] {
  const plan: Attempt[] = [];
  if (gatewayAvailable(env)) {
    for (const model of parseModelList(env.AI_GATEWAY_MODELS ?? env.AI_GATEWAY_MODEL, DEFAULT_GATEWAY_MODELS)) {
      plan.push({ provider: 'vercel-ai-gateway', model });
    }
  }
  if (env.NVIDIA_API_KEY) {
    for (const model of parseModelList(env.NVIDIA_MODELS, DEFAULT_NVIDIA_MODELS)) {
      plan.push({ provider: 'nvidia-nim', model });
    }
  }
  if (env.OPENROUTER_API_KEY) {
    for (const model of parseModelList(env.OPENROUTER_FREE_MODELS, DEFAULT_OPENROUTER_FREE_MODELS)) {
      plan.push({ provider: 'openrouter', model });
    }
  }
  return plan;
}

// ---------------------------------------------------------------------------
// Fallback runner
// ---------------------------------------------------------------------------

export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`Timed out after ${ms}ms`);
    this.name = 'TimeoutError';
  }
}

export class AllProvidersFailedError extends Error {
  constructor(public readonly failures: { attempt: Attempt; error: string }[]) {
    super(failures.length ? 'All AI providers failed' : 'No AI provider is configured');
    this.name = 'AllProvidersFailedError';
  }
}

export interface FallbackOptions {
  perAttemptTimeoutMs: number;
  totalBudgetMs: number;
  now?: () => number;
}

export type AttemptRunner = (attempt: Attempt, signal: AbortSignal) => Promise<string>;

export function describeError(error: unknown): string {
  if (error && typeof error === 'object') {
    const e = error as { name?: string; message?: string; statusCode?: number; status?: number };
    const status = e.statusCode ?? e.status;
    return `${e.name ?? 'Error'}${status ? ` (${status})` : ''}: ${(e.message ?? '').slice(0, 200)}`;
  }
  return String(error).slice(0, 200);
}

/**
 * Try each attempt in order. Any error (HTTP error, 429 rate limit, timeout,
 * empty reply) moves on to the next attempt. Throws AllProvidersFailedError
 * when every attempt fails or the total budget is exhausted.
 */
export async function runWithFallback(
  plan: Attempt[],
  run: AttemptRunner,
  options: FallbackOptions
): Promise<{ text: string; attempt: Attempt; failures: { attempt: Attempt; error: string }[] }> {
  const now = options.now ?? Date.now;
  const started = now();
  const failures: { attempt: Attempt; error: string }[] = [];

  for (const attempt of plan) {
    const remaining = options.totalBudgetMs - (now() - started);
    if (remaining <= 0) break;
    const timeoutMs = Math.min(options.perAttemptTimeoutMs, remaining);

    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        reject(new TimeoutError(timeoutMs));
      }, timeoutMs);
    });

    try {
      const text = (await Promise.race([run(attempt, controller.signal), timeout])).trim();
      if (!text) throw new Error('Empty response');
      return { text, attempt, failures };
    } catch (error) {
      failures.push({ attempt, error: describeError(error) });
    } finally {
      clearTimeout(timer);
    }
  }

  throw new AllProvidersFailedError(failures);
}

// ---------------------------------------------------------------------------
// Simple per-IP rate limiter (best effort, per function instance)
// ---------------------------------------------------------------------------

export class RateLimiter {
  private hits = new Map<string, number[]>();

  constructor(private readonly limit: number, private readonly windowMs: number) {}

  check(key: string, now: number = Date.now()): { allowed: boolean; retryAfterSeconds: number } {
    const windowStart = now - this.windowMs;
    const recent = (this.hits.get(key) ?? []).filter((t) => t > windowStart);
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((recent[0] + this.windowMs - now) / 1000)) };
    }
    recent.push(now);
    this.hits.set(key, recent);
    if (this.hits.size > 5000) {
      for (const [k, v] of this.hits) {
        if (!v.length || v[v.length - 1] <= windowStart) this.hits.delete(k);
      }
    }
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headers.get('x-real-ip') ?? 'unknown';
}
