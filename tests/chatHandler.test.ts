import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET, POST } from '../api/chat';

const KEYS = ['AI_GATEWAY_API_KEY', 'VERCEL_OIDC_TOKEN', 'VERCEL', 'NVIDIA_API_KEY', 'OPENROUTER_API_KEY'];
const saved: Record<string, string | undefined> = {};

function post(body: unknown, ip = '203.0.113.1') {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  });
}

describe('/api/chat handler', () => {
  beforeEach(() => {
    for (const k of KEYS) {
      saved[k] = process.env[k];
      delete process.env[k];
    }
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    for (const k of KEYS) if (saved[k] !== undefined) process.env[k] = saved[k];
    vi.restoreAllMocks();
  });

  it('returns clean JSON with the contact fallback when no provider is configured', async () => {
    const res = await POST(post({ message: 'Do you offer mobile patrols?' }));
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toBe('ai_not_configured');
    expect(data.fallback).toContain('admin@stigg.ca');
  });

  it('rejects invalid input', async () => {
    expect((await POST(post('not json', '203.0.113.2'))).status).toBe(400);
    expect((await POST(post({ message: '' }, '203.0.113.2'))).status).toBe(400);
  });

  it('only allows POST', async () => {
    expect(GET().status).toBe(405);
  });

  it('rate limits a single IP', async () => {
    let last = 0;
    for (let i = 0; i < 21; i++) last = (await POST(post({ message: 'x' }, '203.0.113.9'))).status;
    expect(last).toBe(429);
  });
});
