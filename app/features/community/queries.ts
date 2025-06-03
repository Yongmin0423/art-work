import client from "~/supa-client";

export const getTopics = async () => {
  const { data, error } = await client.from("topics").select("name,slug");
  if (error) throw error;
  return data;
};

export const getPosts = async () => {
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

export const getPost = async ({ postId }: { postId: string }) => {
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
