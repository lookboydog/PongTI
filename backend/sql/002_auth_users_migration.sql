-- 若已执行过旧版 001_init.sql，可运行此迁移以支持登录认证
-- wrangler d1 execute innerspectrum_db --local --file=../sql/002_auth_users_migration.sql

-- 重建 users 表（合并认证字段与测评档案字段）
CREATE TABLE IF NOT EXISTS users_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    name TEXT,
    password_hash TEXT,
    nickname TEXT,
    avatar_seed TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users_new (id, nickname, avatar_seed, created_at)
SELECT
    CAST(id AS INTEGER),
    nickname,
    avatar_seed,
    created_at
FROM users
WHERE typeof(id) = 'text' AND id GLOB '[0-9]*';

INSERT INTO users_new (nickname, avatar_seed, created_at)
SELECT nickname, avatar_seed, created_at
FROM users
WHERE typeof(id) = 'text' AND id NOT GLOB '[0-9]*';

DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
