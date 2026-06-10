const ALLOWED_METHODS = "GET, POST, OPTIONS";
const ALLOWED_HEADERS = "Content-Type, Authorization";

export function getCorsOrigin(env: { CORS_ORIGIN?: string }): string {
  return env.CORS_ORIGIN?.trim() || "*";
}

export function corsHeaders(env: { CORS_ORIGIN?: string }, extra: Record<string, string> = {}): HeadersInit {
  return {
    "Access-Control-Allow-Origin": getCorsOrigin(env),
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
    ...extra,
  };
}

export function jsonResponse(
  env: { CORS_ORIGIN?: string },
  data: unknown,
  status = 200
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(env, { "Content-Type": "application/json" }),
  });
}

export function handlePreflight(env: { CORS_ORIGIN?: string }): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(env),
  });
}
