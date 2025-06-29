-- Simple view for commission with artist information and portfolio images
DROP VIEW IF EXISTS commission_with_artist;

CREATE VIEW commission_with_artist AS
SELECT 
    c.commission_id,
    c.profile_id,
    c.title,
    c.description,
    c.category,
    c.tags,
    c.price_start,
    c.price_options,
    c.turnaround_days,
    c.revision_count,
    c.base_size,
    c.status,
    c.likes_count,
    c.order_count,
    c.views_count,
    c.created_at,
    c.updated_at,
    c.is_featured_weekly,
    -- 관리자 승인 관련 필드
    c.approved_by,
    c.approved_at,
    c.rejection_reason,
    -- Artist information
    p.name as artist_name,
    p.username as artist_username,
    p.job_title as artist_job_title,
    p.bio as artist_bio,
    p.avatar_url as artist_avatar_url,
    p.work_status as artist_work_status,
    p.location as artist_location,
    p.website as artist_website,
    p.followers_count as artist_followers_count,
    p.following_count as artist_following_count,
    p.views_count as artist_views_count,
    -- Commission images (ordered by display_order)
    COALESCE(
        (
            SELECT jsonb_agg(ci.image_url ORDER BY ci.display_order)
            FROM commission_images ci
            WHERE ci.commission_id = c.commission_id
        ),
        '[]'::jsonb
    ) as images,
    -- Artist average rating (calculated from reviews)
    COALESCE(
        (SELECT ROUND(AVG(r.rating)::numeric, 1)
         FROM reviews r
         WHERE r.profile_id = c.profile_id),
        0
    ) as artist_avg_rating
FROM commission c
LEFT JOIN profiles p ON c.profile_id = p.profile_id; 