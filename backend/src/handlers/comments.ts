import { jsonResponse } from "../cors";
import type {
  CommentReplyRow,
  CommentRow,
  CreateCommentBody,
  CreateReplyBody,
  Env,
} from "../types";

function mapCommentRow(row: CommentRow, replies: CommentReplyRow[]) {
  return {
    id: row.id,
    author: row.author,
    avatarSeed: row.avatar_seed,
    mbtiTag: row.mbti_tag ?? undefined,
    content: row.content,
    likes: row.likes,
    stars: row.stars,
    timestamp: row.timestamp,
    replies: replies.map((reply) => ({
      id: reply.id,
      author: reply.author,
      mbtiTag: reply.mbti_tag ?? undefined,
      content: reply.content,
      likes: reply.likes,
      timestamp: reply.timestamp,
    })),
  };
}

export async function listComments(env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(
    "SELECT * FROM comments ORDER BY timestamp DESC LIMIT 100"
  ).all<CommentRow>();

  const commentsWithReplies = await Promise.all(
    results.map(async (comment) => {
      const repliesRes = await env.DB.prepare(
        "SELECT * FROM comment_replies WHERE comment_id = ? ORDER BY timestamp ASC"
      )
        .bind(comment.id)
        .all<CommentReplyRow>();

      return mapCommentRow(comment, repliesRes.results);
    })
  );

  return jsonResponse(env, commentsWithReplies);
}

export async function createComment(env: Env, request: Request): Promise<Response> {
  const body = (await request.json()) as CreateCommentBody & {
    avatarSeed?: string;
    mbtiTag?: string;
  };
  const id = body.id;
  const author = body.author;
  const avatar_seed = body.avatar_seed ?? body.avatarSeed;
  const mbti_tag = body.mbti_tag ?? body.mbtiTag;
  const content = body.content;
  const timestamp = body.timestamp;

  if (!id || !author || !avatar_seed || !content || !timestamp) {
    return jsonResponse(env, { error: "Missing required fields" }, 400);
  }

  await env.DB.prepare(
    `INSERT INTO comments (id, author, avatar_seed, mbti_tag, content, likes, stars, timestamp)
     VALUES (?, ?, ?, ?, ?, 0, 0, ?)`
  )
    .bind(id, author, avatar_seed, mbti_tag ?? null, content, timestamp)
    .run();

  return jsonResponse(env, { success: true });
}

export async function likeComment(env: Env, commentId: string): Promise<Response> {
  const result = await env.DB.prepare(
    "UPDATE comments SET likes = likes + 1 WHERE id = ?"
  )
    .bind(commentId)
    .run();

  if (result.meta.changes === 0) {
    return jsonResponse(env, { error: "Comment not found" }, 404);
  }

  return jsonResponse(env, { success: true });
}

export async function starComment(env: Env, commentId: string): Promise<Response> {
  const result = await env.DB.prepare(
    "UPDATE comments SET stars = stars + 1 WHERE id = ?"
  )
    .bind(commentId)
    .run();

  if (result.meta.changes === 0) {
    return jsonResponse(env, { error: "Comment not found" }, 404);
  }

  return jsonResponse(env, { success: true });
}

export async function createReply(
  env: Env,
  commentId: string,
  request: Request
): Promise<Response> {
  const body = (await request.json()) as CreateReplyBody & { mbtiTag?: string };
  const id = body.id;
  const author = body.author;
  const mbti_tag = body.mbti_tag ?? body.mbtiTag;
  const content = body.content;
  const timestamp = body.timestamp;

  if (!id || !author || !content || !timestamp) {
    return jsonResponse(env, { error: "Missing required fields" }, 400);
  }

  const parent = await env.DB.prepare("SELECT id FROM comments WHERE id = ?")
    .bind(commentId)
    .first();

  if (!parent) {
    return jsonResponse(env, { error: "Comment not found" }, 404);
  }

  await env.DB.prepare(
    `INSERT INTO comment_replies (id, comment_id, author, mbti_tag, content, likes, timestamp)
     VALUES (?, ?, ?, ?, ?, 0, ?)`
  )
    .bind(id, commentId, author, mbti_tag ?? null, content, timestamp)
    .run();

  return jsonResponse(env, { success: true });
}

export async function likeReply(
  env: Env,
  commentId: string,
  replyId: string
): Promise<Response> {
  const result = await env.DB.prepare(
    `UPDATE comment_replies SET likes = likes + 1
     WHERE id = ? AND comment_id = ?`
  )
    .bind(replyId, commentId)
    .run();

  if (result.meta.changes === 0) {
    return jsonResponse(env, { error: "Reply not found" }, 404);
  }

  return jsonResponse(env, { success: true });
}
