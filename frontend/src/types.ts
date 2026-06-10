/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/** 全站主题（导航栏切换） */
export type ThemeMode = 'dark' | 'light';

/** 认证表单专用主题标识（登录/注册组件） */
export type AuthFormThemeMode = 'DARK' | 'LIGHT';

export type ViewType =
  | 'home'
  | 'test'
  | 'result'
  | 'types'
  | 'comments'
  | 'about'
  | 'auth';

export type ActiveForm = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD';

export type ToastType = 'success' | 'error' | 'info';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  verificationCode: string;
}

export interface SendVerificationCodeRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface AuthSuccessResponse {
  success: true;
  message: string;
  token?: string;
  user?: AuthUser;
}

export interface AuthErrorResponse {
  error: string;
}

export type PersonalityGroup = 'Analysts' | 'Diplomats' | 'Sentinels' | 'Explorers';

export interface PersonalityType {
  id: string;
  name: string;
  englishName: string;
  title: string;
  group: PersonalityGroup;
  icon: string;
  description: string;
  avatar: string;
  traits: string[];
  stats: {
    resonance: number;
    empathy: number;
    creation: number;
    order: number;
  };
  bestPartners: string[];
  weakness: string;
  celestialForce: string;
  milestones: string[];
  historicalFigures: string[];
}

export interface Question {
  id: number;
  text: string;
  category: 'EI' | 'SN' | 'TF' | 'JP';
  options: {
    text: string;
    value: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
    score: number;
  }[];
}

export interface TestResult {
  mbti: string;
  nickname?: string;
  typeInfo: PersonalityType;
  dimensions: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
  matchedCharacter?: any;
  shadowCharacter?: any;
  similarityScore?: number;
}

export interface Comment {
  id: string;
  author: string;
  avatarSeed: string;
  content: string;
  timestamp: string;
  likes: number;
  stars: number;
  hasLiked?: boolean;
  hasStarred?: boolean;
  mbtiTag?: string;
  replies?: CommentReply[];
}

export interface CommentReply {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  mbtiTag?: string;
  likes?: number;
  hasLiked?: boolean;
}

/** 将全站主题映射为认证表单主题 */
export function toAuthFormTheme(theme: ThemeMode): AuthFormThemeMode {
  return theme === 'dark' ? 'DARK' : 'LIGHT';
}
