DROP TABLE IF EXISTS post_comments CASCADE;

CREATE TABLE post_comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  comment_content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);