export interface Env {
  DB: D1Database;
  /** 可选：生产环境指定允许的 CORS 来源，默认 * */
  CORS_ORIGIN?: string;
  /** JWT 签名密钥，生产环境请用 wrangler secret put JWT_SECRET */
  JWT_SECRET?: string;
  /** Resend 邮件 API Key */
  RESEND_API_KEY?: string;
  /** 发件邮箱，如 noreply@yourdomain.com */
  EMAIL_FROM?: string;
}

export interface CommentRow {
  id: string;
  author: string;
  avatar_seed: string;
  mbti_tag: string | null;
  content: string;
  likes: number;
  stars: number;
  timestamp: string;
}

export interface CommentReplyRow {
  id: string;
  comment_id: string;
  author: string;
  mbti_tag: string | null;
  content: string;
  likes: number;
  timestamp: string;
}

export interface CreateCommentBody {
  id: string;
  author: string;
  avatar_seed: string;
  mbti_tag?: string;
  content: string;
  timestamp: string;
}

export interface CreateReplyBody {
  id: string;
  author: string;
  mbti_tag?: string;
  content: string;
  timestamp: string;
}

export interface CreateTestRecordBody {
  id: string;
  user: {
    id?: number;
    nickname: string;
    avatar_seed: string;
  };
  mbti: string;
  stats: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
}
