-- Seed data for the new simplified structure

-- Topics
INSERT INTO topics (topic_id, name, slug, description) OVERRIDING SYSTEM VALUE VALUES
(1, 'Character Design', 'character-design', 'Commission requests for character designs'),
(2, 'Illustration', 'illustration', 'General illustration commissions'),
(3, '3D Art', '3d-art', 'Commission requests for 3D art'),
(4, 'Animation', 'animation', 'Commission requests for animations'),
(5, 'Concept Art', 'concept-art', 'Commission requests for concept art');

-- Posts
INSERT INTO posts (post_id, title, content, profile_id, topic_id) OVERRIDING SYSTEM VALUE VALUES
(1, 'Looking for Character Designer', 'I''m looking for someone who can create a unique character design for my story.', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 1),
(2, 'New Commission Available', 'I''m now accepting illustration commissions for fantasy scenes.', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 2),
(3, '3D Model Request', 'Need a 3D model of a fantasy creature for my game.', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 3),
(4, 'Animation Project', 'Looking for an animator for a short film project.', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 4),
(5, 'Concept Art Needed', 'Need concept art for a new sci-fi project.', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 5);

-- Artist Portfolio (one per artist)
INSERT INTO artist_portfolio (artist_id, title, description, images, category, tags, views_count) VALUES
('c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'My Art Portfolio', 'A collection of my best artwork', '["https://example.com/fantasy-character-1.jpg", "https://example.com/landscape-1.jpg", "https://example.com/dragon-model-1.jpg", "https://example.com/live2d-1.jpg", "https://example.com/cyberpunk-1.jpg"]'::jsonb, 'mixed', '["fantasy", "character", "landscape", "3d", "live2d", "concept"]'::jsonb, 500);

-- Commissions (simply reference artist_id)
INSERT INTO commission (commission_id, artist_id, title, description, category, tags, price_start, price_options, turnaround_days, revision_count, base_size) OVERRIDING SYSTEM VALUE VALUES
(1, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'Fantasy Character Design', 'Create a unique fantasy character design', 'character', '["fantasy", "character"]'::jsonb, 500, '[]'::jsonb, 7, 3, '3000x3000'),
(2, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'Illustration Commission', 'High-quality digital illustration', 'illustration', '["landscape", "digital"]'::jsonb, 300, '[]'::jsonb, 5, 2, '2000x2000'),
(3, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', '3D Model Creation', 'Create a 3D model from reference', 'virtual-3d', '["3d", "model"]'::jsonb, 800, '[]'::jsonb, 10, 1, '4000x4000'),
(4, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'Live2D Character', 'Create a Live2D character for your game', 'live2d', '["live2d", "mobile"]'::jsonb, 600, '[]'::jsonb, 7, 2, '2500x2500'),
(5, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'Concept Art', 'Create concept art for your project', 'concept-art', '["concept", "cyberpunk"]'::jsonb, 400, '[]'::jsonb, 5, 3, '3000x3000');

-- Commission Likes
INSERT INTO commission_like (commission_id, profile_id) VALUES
(1, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d'),
(2, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d'),
(3, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d');

-- Commission Orders
INSERT INTO commission_order (order_id, commission_id, client_id, artist_id, total_price, requirements, deadline, status) OVERRIDING SYSTEM VALUE VALUES
(1, 1, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 500, 'Need a fantasy elf character', '2025-07-01', 'pending'),
(2, 2, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 300, 'Create a forest scene', '2025-07-05', 'pending'),
(3, 3, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 800, 'Dragon model for game', '2025-07-10', 'pending'),
(4, 4, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 600, 'Live2D character for mobile game', '2025-07-15', 'pending'),
(5, 5, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 400, 'Cyberpunk cityscape', '2025-07-20', 'pending');

-- Order Status History
INSERT INTO order_status_history (history_id, order_id, from_status, to_status, changed_by, reason) OVERRIDING SYSTEM VALUE VALUES
(1, 1, 'pending', 'accepted', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'Commission accepted'),
(2, 2, 'pending', 'accepted', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'Commission accepted'),
(3, 3, 'pending', 'accepted', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'Commission accepted');

-- Post Upvotes
INSERT INTO post_upvotes (post_id, profile_id) VALUES
(1, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d'),
(2, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d'),
(3, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d');

-- Post Replies
INSERT INTO post_replies (post_reply_id, post_id, profile_id, reply) OVERRIDING SYSTEM VALUE VALUES
(1, 1, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'I can help with character design!'),
(2, 2, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'I''m interested in your illustration services!'),
(3, 3, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'Can you show some examples?');

-- Reviews
INSERT INTO reviews (review_id, order_id, commission_id, artist_id, reviewer_id, title, description, rating) OVERRIDING SYSTEM VALUE VALUES
(1, 1, 1, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'Great Character Design', 'The artist created a fantastic character design that exceeded my expectations.', 5),
(2, 2, 2, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'Beautiful Illustration', 'The illustration was exactly what I wanted and delivered on time.', 5),
(3, 3, 3, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'Excellent 3D Model', 'The 3D model was well crafted and fit perfectly into my game.', 5);

-- Review Comments
INSERT INTO review_comments (comment_id, review_id, profile_id, comment) OVERRIDING SYSTEM VALUE VALUES
(1, 1, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'I love the attention to detail!'),
(2, 2, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'The colors are amazing!'),
(3, 3, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'Great work!');

-- Message Rooms
INSERT INTO message_rooms (message_room_id, room_type, room_name, created_by) OVERRIDING SYSTEM VALUE VALUES
(1, 'direct', 'Commission Discussion', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d'),
(2, 'group', 'Art Community Chat', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d');

-- Message Room Members
INSERT INTO message_room_members (message_room_id, profile_id) VALUES
(1, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d'),
(2, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d');

-- Messages
INSERT INTO messages (message_id, message_room_id, sender_id, content, message_type) OVERRIDING SYSTEM VALUE VALUES
(1, 1, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'Let''s discuss the character design details.', 'text'),
(2, 2, 'c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'Welcome to the art community chat!', 'text');

-- Follows
INSERT INTO follows (follower_id, following_id) VALUES
('c5879f19-ceeb-4a49-922c-1d2ecf04953d', 'c5879f19-ceeb-4a49-922c-1d2ecf04953d');

-- Logo (홈페이지 로고)
INSERT INTO logo (title, image_url, alt_text, is_active) VALUES
('Artwork Platform Logo', 'https://cdn.gameinsight.co.kr/news/photo/202211/25171_64125_5958.jpg', 'Artwork Platform Main Logo', 'true');

-- Category Showcase (bento-grid 카테고리 이미지들)
INSERT INTO category_showcase (title, image_url, alt_text, display_order, is_active) VALUES
('Character Design', 'https://storage.googleapis.com/static.fastcampus.co.kr/prod/uploads/202211/131729-914/illust-ekina-portfolio-04.png', 'Character Design Category', 1, 'true'),
('Animation', 'https://cdn.gameinsight.co.kr/news/photo/202007/20941_49865_1849.gif', 'Animation Category', 2, 'true'),
('Illustration', 'https://artmug.kr/image/cate_banner/cateBanner13_1.jpg', 'Illustration Category', 3, 'true'),
('Digital Art', 'https://artmug.kr/image/cate_banner/ECA09CEBAAA9-EC9786EC9D8C-2_2.jpg', 'Digital Art Category', 4, 'true'),
('Concept Art', 'https://artmug.kr/image/cate_banner/cateBanner14.jpg', 'Concept Art Category', 5, 'true'); 