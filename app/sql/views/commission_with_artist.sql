-- Simple view for commission with artist information and portfolio images
DROP VIEW IF EXISTS commission_with_artist;

CREATE VIEW commission_with_artist AS
SELECT 
    c.commission_id,
    c.artist_id,
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
    -- Artist average rating (calculated from reviews)
    COALESCE(
        (SELECT ROUND(AVG(r.rating)::numeric, 1)
         FROM reviews r
         WHERE r.artist_id = c.artist_id),
        0
    ) as artist_avg_rating,
    -- Portfolio images directly from artist_portfolio
    COALESCE(ap.images, '[]'::jsonb) as images
FROM commission c
LEFT JOIN profiles p ON c.artist_id = p.profile_id
LEFT JOIN artist_portfolio ap ON c.artist_id = ap.artist_id; 