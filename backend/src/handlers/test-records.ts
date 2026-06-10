import { jsonResponse } from "../cors";
import type { CreateTestRecordBody, Env } from "../types";

export async function createTestRecord(env: Env, request: Request): Promise<Response> {
  const body = (await request.json()) as CreateTestRecordBody;
  const { id, user, mbti, stats } = body;

  if (!id || !user?.nickname || !mbti || !stats) {
    return jsonResponse(env, { error: "Missing required fields" }, 400);
  }

  const dimensions = ["E", "I", "S", "N", "T", "F", "J", "P"] as const;
  for (const key of dimensions) {
    const value = stats[key];
    if (typeof value !== "number" || value < 0 || value > 100) {
      return jsonResponse(env, { error: `Invalid stat value for ${key}` }, 400);
    }
  }

  let userId = user.id ?? null;

  if (!userId) {
    const insertUser = await env.DB.prepare(
      "INSERT INTO users (nickname, avatar_seed) VALUES (?, ?)"
    )
      .bind(user.nickname, user.avatar_seed ?? null)
      .run();

    userId = insertUser.meta.last_row_id ?? null;
  } else {
    await env.DB.prepare(
      "UPDATE users SET nickname = ?, avatar_seed = ? WHERE id = ?"
    )
      .bind(user.nickname, user.avatar_seed ?? null, userId)
      .run();
  }

  await env.DB.prepare(
    `INSERT INTO test_records (
      id, user_id, mbti,
      score_e, score_i, score_s, score_n,
      score_t, score_f, score_j, score_p
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      userId,
      mbti,
      stats.E,
      stats.I,
      stats.S,
      stats.N,
      stats.T,
      stats.F,
      stats.J,
      stats.P
    )
    .run();

  return jsonResponse(env, { success: true, userId });
}
