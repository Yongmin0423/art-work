import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const createPost = async (
  client: SupabaseClient<Database>,
  {
    title,
    category,
    content,
    userId,
  }: {
    title: string;
    category: string;
    content: string;
    userId: string;
  }
) => {
  const { data: categoryData, error: categoryError } = await client
    .from("topics")
    .select("topic_id")
    .eq("slug", category)
    .single();
  if (categoryError) {
    throw categoryError;
  }

  const { data, error } = await client
    .from("posts")
    .insert({
      title,
      content,
      profile_id: userId,
      topic_id: categoryData.topic_id,
    })
    .select()
    .single();

  // 중복 키 오류 처리
  if (error && error.code === "23505" && error.message.includes("posts_pkey")) {
    console.error("Database sequence sync issue detected!");
    console.error("Error details:", error);
    console.error(
      "This usually means the posts_post_id_seq is out of sync with existing data."
    );
    console.error("Please run this SQL in Supabase SQL Editor:");
    console.error(
      "SELECT setval('posts_post_id_seq', (SELECT MAX(post_id) FROM posts) + 1, false);"
    );

    // 더 구체적인 에러 메시지 제공
    throw new Error(
      "Database sequence synchronization error. The auto-increment sequence for posts is out of sync. " +
        "Please contact your database administrator or run the sequence fix query in Supabase SQL Editor."
    );
  }

  if (error) {
    throw error;
  }
  return data;
};

export const createReply = async (
  client: SupabaseClient<Database>,
  { postId, reply, userId }: { postId: string; reply: string; userId: string }
) => {
  const { data, error } = await client
    .from("post_replies")
    .insert({ post_id: Number(postId), reply, profile_id: userId });
  if (error) {
    throw error;
  }
};
