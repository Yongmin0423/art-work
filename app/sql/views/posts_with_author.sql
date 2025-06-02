-- View for posts with author information
CREATE OR REPLACE VIEW posts_with_author AS
SELECT 
    p.post_id,
    p.title,
    p.content,
    p.upvotes_count,
    p.replies_count,
    p.views_count,
    p.is_pinned,
    p.is_locked,
    p.created_at,
    p.updated_at,
    p.topic_id,
    p.profile_id,
    -- Author information
    pr.name as author_name,
    pr.username as author_username,
    pr.job_title as author_job_title,
    pr.avatar_url as author_avatar_url,
    -- Topic information
    t.name as topic_name,
    t.slug as topic_slug,
    t.description as topic_description
FROM posts p
LEFT JOIN profiles pr ON p.profile_id = pr.profile_id
LEFT JOIN topics t ON p.topic_id = t.topic_id; 