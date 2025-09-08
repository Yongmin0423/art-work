DROP VIEW IF EXISTS community_post_list_view;

CREATE VIEW community_post_list_view AS
SELECT
  posts.post_id,
  posts.title,
  posts.created_at,
  topics.name AS topic,
  profiles.name AS author,
  profiles.avatar_url AS author_avatar,
  profiles.username AS author_username,
  posts.upvotes_count,
  topics.slug AS topic_slug,
  (SELECT EXISTS(SELECT 1 FROM post_upvotes WHERE post_upvotes.post_id = posts.post_id AND post_upvotes.profile_id = auth.uid())) AS is_upvoted
FROM posts
INNER JOIN topics USING (topic_id)
INNER JOIN profiles USING (profile_id);
