import { jsonResponse } from "../cors";
import { verifyEmailCode } from "./email-verification";
import { hashPassword, signJWT } from "../utils/crypto";
import type { Env } from "../types";

interface AuthUserRow {
  id: number;
  email: string;
  name: string;
  password_hash: string;
}

export async function signup(env: Env, request: Request): Promise<Response> {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    name?: string;
    verificationCode?: string;
  };
  const email = body.email?.trim().toLowerCase();
  const { password, name, verificationCode } = body;

  if (!email || !password || !name || !verificationCode) {
    return jsonResponse(env, { error: "必须完整提供昵称、邮箱、验证码与密码" }, 400);
  }

  if (password.length < 6) {
    return jsonResponse(env, { error: "安全密码长度不得低于 6 位" }, 400);
  }

  const codeValid = await verifyEmailCode(env, email, verificationCode.trim());
  if (!codeValid) {
    return jsonResponse(env, { error: "验证码无效或已过期，请重新获取" }, 400);
  }

  try {
    const pwdHash = await hashPassword(password);
    const result = await env.DB.prepare(
      "INSERT INTO users (email, name, password_hash, nickname) VALUES (?, ?, ?, ?)"
    )
      .bind(email, name, pwdHash, name)
      .run();

    if (!result.success) {
      return jsonResponse(env, { error: "数据安全中心写入异常" }, 500);
    }

    return jsonResponse(env, {
      success: true,
      message: "✨ 注册成功，欢迎开启契约之旅！",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "服务层异常";
    if (message.includes("UNIQUE")) {
      return jsonResponse(env, { error: "🪐 该邮箱已被其他账号占用" }, 400);
    }
    return jsonResponse(env, { error: message }, 500);
  }
}

export async function login(env: Env, request: Request): Promise<Response> {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };
  const { email, password } = body;

  if (!email || !password) {
    return jsonResponse(env, { error: "缺少邮箱或密码" }, 400);
  }

  const user = await env.DB.prepare(
    "SELECT id, email, name, password_hash FROM users WHERE email = ?"
  )
    .bind(email)
    .first<AuthUserRow>();

  if (!user) {
    return jsonResponse(env, { error: "🛸 未检索到注册记录" }, 401);
  }

  const inputHash = await hashPassword(password);
  if (user.password_hash !== inputHash) {
    return jsonResponse(env, { error: "🧬 密码校验不匹配" }, 401);
  }

  const token = await signJWT(
    { id: user.id, email: user.email },
    env.JWT_SECRET || "InnerSphereSecretKey"
  );

  return jsonResponse(env, {
    success: true,
    message: "同频登录成功！",
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
}

export async function forgotPassword(env: Env, request: Request): Promise<Response> {
  const body = (await request.json()) as { email?: string };
  const { email } = body;

  if (!email) {
    return jsonResponse(env, { error: "请先填写您的邮箱地址" }, 400);
  }

  const user = await env.DB.prepare("SELECT id FROM users WHERE email = ?")
    .bind(email)
    .first();

  if (!user) {
    return jsonResponse(env, { error: "系统未找到对应的用户邮箱记录" }, 404);
  }

  return jsonResponse(env, {
    success: true,
    message: `✉ 安全重置信标已下发至 ${email}，请查收！`,
  });
}
