// POST /api/chat — server-side AI chat for the "AI Security Expert" widget.
// Primary: Vercel AI Gateway (AI_GATEWAY_API_KEY or Vercel OIDC).
// Fallback 1: NVIDIA NIM (NVIDIA_API_KEY). Fallback 2: OpenRouter free models (OPENROUTER_API_KEY).
// No provider keys are ever sent to the browser.
import { gateway, generateText } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import {
  AllProvidersFailedError,
  RateLimiter,
  buildAttemptPlan,
  clientIp,
  runWithFallback,
  validateChatRequest,
  type Attempt
} from './_lib/chatCore.js';
import { buildSystemPrompt } from './_lib/prompts.js';

export const config = { maxDuration: 60 };

const PER_ATTEMPT_TIMEOUT_MS = 10_000;
const TOTAL_BUDGET_MS = 40_000;
const MAX_BODY_BYTES = 32_000;

const rateLimiter = new RateLimiter(20, 60_000); // 20 requests / minute / IP / instance

const FALLBACK_MESSAGE =
  "I apologize, but I'm experiencing technical difficulties. Please contact our team directly at admin@stigg.ca, call 1-587-644-4644, or text/call 780-215-2887 for immediate assistance.";

function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }
  });
}

let openrouter: ReturnType<typeof createOpenAICompatible> | undefined;
function getOpenRouter() {
  openrouter ??= createOpenAICompatible({
    name: 'openrouter',
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    headers: { 'HTTP-Referer': 'https://www.stigg.ca', 'X-Title': 'Stigg Security AI Assistant' }
  });
  return openrouter;
}

let nvidia: ReturnType<typeof createOpenAICompatible> | undefined;
function getNvidia() {
  nvidia ??= createOpenAICompatible({
    name: 'nvidia-nim',
    baseURL: 'https://integrate.api.nvidia.com/v1',
    apiKey: process.env.NVIDIA_API_KEY
  });
  return nvidia;
}

function modelFor(attempt: Attempt) {
  switch (attempt.provider) {
    case 'vercel-ai-gateway':
      return gateway(attempt.model);
    case 'nvidia-nim':
      return getNvidia().chatModel(attempt.model);
    case 'openrouter':
      return getOpenRouter().chatModel(attempt.model);
  }
}

export async function POST(request: Request): Promise<Response> {
  const limit = rateLimiter.check(clientIp(request.headers));
  if (!limit.allowed) {
    return json(429, { error: 'rate_limited', fallback: FALLBACK_MESSAGE }, { 'retry-after': String(limit.retryAfterSeconds) });
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return json(413, { error: 'payload_too_large' });
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json(413, { error: 'payload_too_large' });
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: 'invalid_json' });
  }

  const parsed = validateChatRequest(body);
  if (!parsed.ok) return json(400, { error: 'invalid_request', message: parsed.error });
  const { message, history, serviceType, userProfile } = parsed.value;

  const system = buildSystemPrompt(message, { serviceType, userProfile, hasHistory: history.length > 0 });
  const plan = buildAttemptPlan(process.env);

  try {
    const result = await runWithFallback(
      plan,
      async (attempt, signal) => {
        const { text } = await generateText({
          model: modelFor(attempt),
          system,
          messages: [...history, { role: 'user', content: message }],
          maxOutputTokens: 800,
          temperature: 0.7,
          maxRetries: 0,
          abortSignal: signal
        });
        return text;
      },
      { perAttemptTimeoutMs: PER_ATTEMPT_TIMEOUT_MS, totalBudgetMs: TOTAL_BUDGET_MS }
    );

    if (result.failures.length) {
      console.warn('[api/chat] fell back after failures', result.failures);
    }
    return json(200, { response: result.text, provider: result.attempt.provider, model: result.attempt.model });
  } catch (error) {
    const failures = error instanceof AllProvidersFailedError ? error.failures : [];
    console.error('[api/chat] all providers failed', failures.length ? failures : error);
    return json(503, {
      error: plan.length ? 'ai_unavailable' : 'ai_not_configured',
      fallback: FALLBACK_MESSAGE
    });
  }
}

export function GET(): Response {
  return json(405, { error: 'method_not_allowed' }, { allow: 'POST' });
}
