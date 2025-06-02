-- View for reviews with complete details
CREATE OR REPLACE VIEW reviews_with_details AS
SELECT 
    r.review_id,
    r.order_id,
    r.commission_id,
    r.artist_id,
    r.reviewer_id,
    r.title,
    r.description,
    r.rating,
    r.image_url,
    r.likes_count,
    r.views_count,
    r.is_featured,
    r.created_at,
    r.updated_at,
    -- Artist information
    artist.name as artist_name,
    artist.username as artist_username,
    artist.avatar_url as artist_avatar_url,
    -- Reviewer information
    reviewer.name as reviewer_name,
    reviewer.username as reviewer_username,
    reviewer.avatar_url as reviewer_avatar_url,
    -- Commission information
    c.title as commission_title,
    c.category as commission_category,
    c.price_start as commission_price,
    -- Order information
    o.total_price as order_total_price,
    o.status as order_status,
    o.completed_at as order_completed_at
FROM reviews r
LEFT JOIN profiles artist ON r.artist_id = artist.profile_id
LEFT JOIN profiles reviewer ON r.reviewer_id = reviewer.profile_id
LEFT JOIN commission c ON r.commission_id = c.commission_id
LEFT JOIN commission_order o ON r.order_id = o.order_id; 