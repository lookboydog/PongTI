-- 星心八维能量极谱 / Celestial MBTI Spectrum
-- D1 (SQLite) 初始化迁移脚本
-- 执行: wrangler d1 execute innerspectrum_db --local --file=../sql/001_init.sql
-- 远程: wrangler d1 execute innerspectrum_db --remote --file=../sql/001_init.sql

-- 1. 用户基础表（登录认证 + 测评档案）
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    name TEXT,
    password_hash TEXT,
    nickname TEXT,
    avatar_seed TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 测试记录表 (存储星心光谱分数)
CREATE TABLE IF NOT EXISTS test_records (
    id TEXT PRIMARY KEY,
    user_id INTEGER,
    mbti TEXT NOT NULL,
    score_e INTEGER NOT NULL,
    score_i INTEGER NOT NULL,
    score_s INTEGER NOT NULL,
    score_n INTEGER NOT NULL,
    score_t INTEGER NOT NULL,
    score_f INTEGER NOT NULL,
    score_j INTEGER NOT NULL,
    score_p INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. 主社区留痕区（留言评论表）
CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    avatar_seed TEXT NOT NULL,
    mbti_tag TEXT,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    stars INTEGER DEFAULT 0,
    timestamp TEXT NOT NULL
);

-- 4. 评论回复表
CREATE TABLE IF NOT EXISTS comment_replies (
    id TEXT PRIMARY KEY,
    comment_id TEXT NOT NULL,
    author TEXT NOT NULL,
    mbti_tag TEXT,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- 5. 邮箱验证码表（注册校验）
CREATE TABLE IF NOT EXISTS email_verification_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_email_codes_email ON email_verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_email_codes_expires ON email_verification_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_comments_timestamp ON comments(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_comment_replies_comment_id ON comment_replies(comment_id);
CREATE INDEX IF NOT EXISTS idx_test_records_user_id ON test_records(user_id);
CREATE INDEX IF NOT EXISTS idx_test_records_created_at ON test_records(created_at DESC);
