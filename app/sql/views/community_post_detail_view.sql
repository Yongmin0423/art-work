CREATE OR REPLACE VIEW community_post_detail AS
SELECT
    posts.post_id,
    posts.title,
    posts.content,
    posts.upvotes_count,
    posts.replies_count,
    posts.created_at,
    posts.updated_at,
    topics.topic_id,
    topics.name as topic_name,
    topics.slug as topic_slug,
    profiles.profile_id,
    profiles.name as author_name,
    profiles.avatar_url as author_avatar,
    profiles.username as author_username,
    profiles.followers_count,
    profiles.views_count,
    profiles.job_title,
    profiles.location,
    profiles.website,
    profiles.bio,
    (SELECT EXISTS (SELECT 1 FROM public.post_upvotes WHERE post_upvotes.post_id = posts.post_id AND post_upvotes.profile_id = auth.uid())) AS is_upvoted
FROM posts
INNER JOIN topics USING (topic_id)
INNER JOIN profiles ON (profiles.profile_id = posts.profile_id);