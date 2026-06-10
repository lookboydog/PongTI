import type { Env } from "../types";

export function generateVerificationCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendVerificationEmail(
  env: Env,
  email: string,
  code: string
): Promise<void> {
  const apiKey = env.RESEND_API_KEY;
  const from = env.EMAIL_FROM || "onboarding@resend.dev";

  if (!apiKey) {
    throw new Error("邮件服务未配置，请联系管理员设置 RESEND_API_KEY");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `PonyTI <${from}>`,
      to: [email],
      subject: "【PonyTI】邮箱验证码",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
          <h2 style="color:#425e94;">星心八维能量极谱 · 邮箱验证</h2>
          <p>您的注册验证码为：</p>
          <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#0a0b1e;">${code}</p>
          <p style="color:#666;font-size:14px;">验证码 10 分钟内有效，请勿泄露给他人。</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`邮件发送失败: ${err}`);
  }
}
