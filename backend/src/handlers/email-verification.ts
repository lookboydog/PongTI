import { jsonResponse } from "../cors";
import { generateVerificationCode, sendVerificationEmail } from "../utils/email";
import type { Env } from "../types";

const CODE_TTL_MINUTES = 10;
const SEND_COOLDOWN_SECONDS = 60;

export async function sendVerificationCode(
  env: Env,
  request: Request
): Promise<Response> {
  const body = (await request.json()) as { email?: string };
  const email = body.email?.trim().toLowerCase();

  if (!email) {
    return jsonResponse(env, { error: "请提供邮箱地址" }, 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return jsonResponse(env, { error: "邮箱格式不正确" }, 400);
  }

  const existingUser = await env.DB.prepare(
    "SELECT id FROM users WHERE email = ?"
  )
    .bind(email)
    .first();

  if (existingUser) {
    return jsonResponse(env, { error: "该邮箱已被注册" }, 400);
  }

  const recent = await env.DB.prepare(
    `SELECT created_at FROM email_verification_codes
     WHERE email = ? AND used = 0
     ORDER BY created_at DESC LIMIT 1`
  )
    .bind(email)
    .first<{ created_at: string }>();

  if (recent) {
    const createdAt = new Date(recent.created_at).getTime();
    const elapsed = (Date.now() - createdAt) / 1000;
    if (elapsed < SEND_COOLDOWN_SECONDS) {
      const wait = Math.ceil(SEND_COOLDOWN_SECONDS - elapsed);
      return jsonResponse(
        env,
        { error: `请 ${wait} 秒后再试` },
        429
      );
    }
  }

  const code = generateVerificationCode();

  // const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000)
  //   .toISOString()
  //   .replace("T", " ")
  //   .substring(0, 19);
  const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000).toISOString();


  await env.DB.prepare(
    "UPDATE email_verification_codes SET used = 1 WHERE email = ? AND used = 0"
  )
    .bind(email)
    .run();

  await env.DB.prepare(
    "INSERT INTO email_verification_codes (email, code, expires_at) VALUES (?, ?, ?)"
  )
    .bind(email, code, expiresAt)
    .run();

  try {
    await sendVerificationEmail(env, email, code);
  } catch (err) {
    const message = err instanceof Error ? err.message : "邮件发送失败";
    return jsonResponse(env, { error: message }, 500);
  }

  return jsonResponse(env, {
    success: true,
    message: `验证码已发送至 ${email}，请查收邮箱（10 分钟内有效）`,
  });
}

export async function verifyEmailCode(
  env: Env,
  email: string,
  code: string
): Promise<boolean> {
  const row = await env.DB.prepare(
    `SELECT id, code, expires_at, used FROM email_verification_codes
     WHERE email = ? AND used = 0
     ORDER BY created_at DESC LIMIT 1`
  )
    .bind(email.toLowerCase())
    .first<{ id: number; code: string; expires_at: string; used: number }>();

  if (!row) return false;
  if (row.code !== code) return false;
  if (row.used === 1) return false;

  const expiresAt = new Date(row.expires_at).getTime();
  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) return false;

  await env.DB.prepare(
    "UPDATE email_verification_codes SET used = 1 WHERE id = ?"
  )
    .bind(row.id)
    .run();

  return true;
}
