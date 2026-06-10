PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    name TEXT,
    password_hash TEXT,
    nickname TEXT,
    avatar_seed TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE test_records (
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
CREATE TABLE comments (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    avatar_seed TEXT NOT NULL,
    mbti_tag TEXT,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    stars INTEGER DEFAULT 0,
    timestamp TEXT NOT NULL
);
CREATE TABLE comment_replies (
    id TEXT PRIMARY KEY,
    comment_id TEXT NOT NULL,
    author TEXT NOT NULL,
    mbti_tag TEXT,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);
CREATE TABLE email_verification_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
DELETE FROM sqlite_sequence;
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_email_codes_email ON email_verification_codes(email);
CREATE INDEX idx_email_codes_expires ON email_verification_codes(expires_at);
CREATE INDEX idx_comments_timestamp ON comments(timestamp DESC);
CREATE INDEX idx_comment_replies_comment_id ON comment_replies(comment_id);
CREATE INDEX idx_test_records_user_id ON test_records(user_id);
CREATE INDEX idx_test_records_created_at ON test_records(created_at DESC);
