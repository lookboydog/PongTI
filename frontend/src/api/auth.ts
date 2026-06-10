import {
  AuthErrorResponse,
  AuthSession,
  AuthSuccessResponse,
  ForgotPasswordRequest,
  LoginRequest,
  SendVerificationCodeRequest,
  SignupRequest,
} from '../types';
import { apiPost, isApiEnabled } from './client';

const AUTH_TOKEN_KEY = 'inner_spectrum_auth_token';
const AUTH_USER_KEY = 'inner_spectrum_auth_user';

async function parseAuthResponse<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & AuthErrorResponse;
  if (!res.ok) {
    throw new Error(data.error || '请求失败，请稍后重试');
  }
  return data;
}

export function saveAuthSession(session: AuthSession): void {
  localStorage.setItem(AUTH_TOKEN_KEY, session.token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
}

export function loadAuthSession(): AuthSession | null {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userRaw = localStorage.getItem(AUTH_USER_KEY);
  if (!token || !userRaw) return null;

  try {
    const user = JSON.parse(userRaw);
    return { token, user };
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export async function loginUser(payload: LoginRequest): Promise<AuthSession> {
  if (!isApiEnabled()) {
    throw new Error('后端 API 未配置，请设置 VITE_API_URL');
  }

  const res = await apiPost('/api/login', payload);
  const data = await parseAuthResponse<AuthSuccessResponse>(res);

  if (!data.token || !data.user) {
    throw new Error('登录响应不完整');
  }

  const session = { token: data.token, user: data.user };
  saveAuthSession(session);
  return session;
}

export async function sendVerificationCode(
  payload: SendVerificationCodeRequest
): Promise<string> {
  if (!isApiEnabled()) {
    throw new Error('后端 API 未配置，请设置 VITE_API_URL');
  }

  const res = await apiPost('/api/send-verification-code', payload);
  const data = await parseAuthResponse<AuthSuccessResponse>(res);
  return data.message;
}

export async function signupUser(payload: SignupRequest): Promise<string> {
  if (!isApiEnabled()) {
    throw new Error('后端 API 未配置，请设置 VITE_API_URL');
  }

  const res = await apiPost('/api/signup', payload);
  const data = await parseAuthResponse<AuthSuccessResponse>(res);
  return data.message;
}

export async function forgotPasswordUser(payload: ForgotPasswordRequest): Promise<string> {
  if (!isApiEnabled()) {
    throw new Error('后端 API 未配置，请设置 VITE_API_URL');
  }

  const res = await apiPost('/api/forgot-password', payload);
  const data = await parseAuthResponse<AuthSuccessResponse>(res);
  return data.message;
}
