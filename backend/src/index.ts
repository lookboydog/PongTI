import { corsHeaders, handlePreflight, jsonResponse } from "./cors";
import {
  createComment,
  createReply,
  likeComment,
  likeReply,
  listComments,
  starComment,
} from "./handlers/comments";
import { forgotPassword, login, signup } from "./handlers/auth";
import { sendVerificationCode } from "./handlers/email-verification";
import { createTestRecord } from "./handlers/test-records";
import type { Env } from "./types";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;
    const { method } = request;

    if (method === "OPTIONS") {
      return handlePreflight(env);
    }

    try {
      if (pathname === "/api/v1/comments" && method === "GET") {
        return await listComments(env);
      }

      if (pathname === "/api/v1/comments" && method === "POST") {
        return await createComment(env, request);
      }

      if (pathname === "/api/v1/test-records" && method === "POST") {
        return await createTestRecord(env, request);
      }

      if (pathname === "/api/send-verification-code" && method === "POST") {
        return await sendVerificationCode(env, request);
      }

      if (pathname === "/api/signup" && method === "POST") {
        return await signup(env, request);
      }

      if (pathname === "/api/login" && method === "POST") {
        return await login(env, request);
      }

      if (pathname === "/api/forgot-password" && method === "POST") {
        return await forgotPassword(env, request);
      }

      const commentLikeMatch = pathname.match(/^\/api\/v1\/comments\/([^/]+)\/like$/);
      if (commentLikeMatch && method === "POST") {
        return await likeComment(env, commentLikeMatch[1]);
      }

      const commentStarMatch = pathname.match(/^\/api\/v1\/comments\/([^/]+)\/star$/);
      if (commentStarMatch && method === "POST") {
        return await starComment(env, commentStarMatch[1]);
      }

      const replyCreateMatch = pathname.match(/^\/api\/v1\/comments\/([^/]+)\/replies$/);
      if (replyCreateMatch && method === "POST") {
        return await createReply(env, replyCreateMatch[1], request);
      }

      const replyLikeMatch = pathname.match(
        /^\/api\/v1\/comments\/([^/]+)\/replies\/([^/]+)\/like$/
      );
      if (replyLikeMatch && method === "POST") {
        return await likeReply(env, replyLikeMatch[1], replyLikeMatch[2]);
      }

      if (pathname === "/health" && method === "GET") {
        return jsonResponse(env, { status: "ok" });
      }

      return jsonResponse(env, { error: "Endpoint not found" }, 404);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Internal server error";
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: corsHeaders(env, { "Content-Type": "application/json" }),
      });
    }
  },
} satisfies ExportedHandler<Env>;
