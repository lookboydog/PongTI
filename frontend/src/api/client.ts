/** Cloudflare Workers API 基础地址，见项目根目录 .env 中的 VITE_API_URL */
export const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export function isApiEnabled(): boolean {
  return API_BASE.length > 0;
}

export async function apiGet(path: string): Promise<Response> {
  return fetch(`${API_BASE}${path}`);
}

export async function apiPost(path: string, body?: unknown): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}
