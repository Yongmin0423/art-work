import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "react-router";
import type { Database } from "~/supa-client";

export const getTopics = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from("topics").select("name,slug");
  if (error) throw error;
  return data;
};

export const getPosts = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from("posts").select(`
    post_id,
    title,
    content,
    created_at,
    updated_at,
    replies_count,
    upvotes_count,
    profiles!posts_profile_id_profiles_profile_id_fk(
      name,
      avatar_url
    ),
    topics!posts_topic_id_topics_topic_id_fk(
      name,
      slug
    )
    `);
  if (error) throw error;
  return data;
};

export const getPost = async (
  client: SupabaseClient<Database>,
  { postId }: { postId: string }
) => {
  const { data, error } = await client
    .from("posts")
    .select(
      `
  post_id,
    title,
    content,
    created_at,
    updated_at,
    replies_count,
    upvotes_count,
    profiles!posts_profile_id_profiles_profile_id_fk(
      name,
      avatar_url,
      followers_count,
      views_count,
      job_title,
      location,
      website,
      bio
    ),
    topics!posts_topic_id_topics_topic_id_fk(
      name,
      slug
    )
  `
    )
    .eq("post_id", parseInt(postId))
    .single();
  if (error) throw error;
  return data;
};

export const getLoggedInUser = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.auth.getUser();
  if (error || data.user === null) {
    throw redirect("/auth/login");
  }
  return data.user.id;
};

export const getPostsByUsername = async (
  client: SupabaseClient<Database>,
  { username }: { username: string }
) => {
  // 먼저 username으로 profile_id를 찾기
  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("profile_id")
    .eq("username", username)
    .single();

  if (profileError) throw profileError;

  // 그 profile_id로 posts 조회
  const { data, error } = await client
    .from("posts")
    .select(
      `
      post_id,
      title,
      content,
      created_at,
      updated_at,
      replies_count,
      upvotes_count,
      profiles!posts_profile_id_profiles_profile_id_fk(
        name,
        avatar_url,
        username
      ),
      topics!posts_topic_id_topics_topic_id_fk(
        name,
        slug
      )
    `
    )
    .eq("profile_id", profile.profile_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getReplies = async (
  client: SupabaseClient<Database>,
  { postId }: { postId: string }
) => {
  const replyQuery = `
    post_reply_id,
    reply,
    created_at,
    user:profiles (
      name,
      avatar_url,
      username
    )
  `;
  const { data, error } = await client
    .from("post_replies")
    .select(
      `
      ${replyQuery},
      post_replies (
        ${replyQuery}
      )
      `
    )
    .eq("post_id", parseInt(postId))
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};
