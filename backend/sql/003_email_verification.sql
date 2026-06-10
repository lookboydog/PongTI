-- 邮箱验证码表
-- wrangler d1 execute innerspectrum_db --local --file=../sql/003_email_verification.sql

-- CREATE TABLE IF NOT EXISTS email_verification_codes (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     email TEXT NOT NULL,
--     code TEXT NOT NULL,
--     expires_at DATETIME NOT NULL,
--     used INTEGER DEFAULT 0,
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE INDEX IF NOT EXISTS idx_email_codes_email ON email_verification_codes(email);
-- CREATE INDEX IF NOT EXISTS idx_email_codes_expires ON email_verification_codes(expires_at);


-- 邮箱验证码表（适配 D1/Cloudflare Workers）
CREATE TABLE IF NOT EXISTS email_verification_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code TEXT(6) NOT NULL,
    expires_at DATETIME NOT NULL,
    used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 联合索引：精准匹配查询条件
CREATE INDEX IF NOT EXISTS idx_email_verification_email_used_expires 
ON email_verification_codes(email, used, expires_at);

-- 保留原索引（可选）
CREATE INDEX IF NOT EXISTS idx_email_codes_email ON email_verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_email_codes_expires ON email_verification_codes(expires_at);