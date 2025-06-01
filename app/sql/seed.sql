-- Seed data for artist table
INSERT INTO artist (name, email, profile_image, bio, social_links)
VALUES 
('John Doe', 'john@example.com', 'https://example.com/john.jpg', 'Digital artist specializing in character design', 
    '{"twitter": "https://twitter.com/johndoe", "instagram": "https://instagram.com/johndoe"}'::jsonb);

-- Seed data for commission table
INSERT INTO commission (artist_id, name, description, price_start, price_end, currency, status, category, turnaround_days, revision_count)
VALUES 
(1, 'Character Design', 'High-quality character design for your project', 100, 300, 'USD', 'available', 'character', 7, 3),
(1, 'Illustration', 'Detailed illustration work', 150, 400, 'USD', 'available', 'illustration', 10, 3),
(1, 'Virtual 3D', '3D character modeling', 200, 500, 'USD', 'available', 'virtual-3d', 14, 2),
(1, 'Live2D', 'Live2D character creation', 250, 600, 'USD', 'available', 'live2d', 21, 2),
(1, 'Design', 'UI/UX design services', 150, 400, 'USD', 'available', 'design', 7, 3);

-- -- Seed data for portfolio table
-- INSERT INTO portfolio (commission_id, image_url, description, is_main)
-- VALUES 
-- (1, 'https://example.com/char1.jpg', 'Example character design', true),
-- (2, 'https://example.com/illu1.jpg', 'Example illustration', false),
-- (3, 'https://example.com/3d1.jpg', 'Example 3D model', false),
-- (4, 'https://example.com/live2d1.jpg', 'Example Live2D', false),
-- (5, 'https://example.com/ui1.jpg', 'Example UI design', false);

-- Seed data for message_rooms table
INSERT INTO message_rooms (created_at)
VALUES 
(now()), (now()), (now()), (now()), (now());

-- Seed data for message_room_members table (composite primary key)
INSERT INTO message_room_members (message_room_id, profile_id, created_at)
VALUES 
(1, '4159ebf0-8859-4128-915a-8274024adb5c', now()),
(2, '4159ebf0-8859-4128-915a-8274024adb5c', now()),
(3, '4159ebf0-8859-4128-915a-8274024adb5c', now()),
(4, '4159ebf0-8859-4128-915a-8274024adb5c', now()),
(5, '4159ebf0-8859-4128-915a-8274024adb5c', now());

-- Seed data for messages table
INSERT INTO messages (message_room_id, sender_id, content)
VALUES 
(1, '4159ebf0-8859-4128-915a-8274024adb5c', 'Hello! I''m interested in your character design services.'),
(2, '4159ebf0-8859-4128-915a-8274024adb5c', 'Can you share your portfolio for illustrations?'),
(3, '4159ebf0-8859-4128-915a-8274024adb5c', 'I''m looking for a 3D model for my game.'),
(4, '4159ebf0-8859-4128-915a-8274024adb5c', 'How long does a Live2D creation take?'),
(5, '4159ebf0-8859-4128-915a-8274024adb5c', 'I need a UI design for my app.');

-- Seed data for follows table (composite primary key)
INSERT INTO follows (follower_id, following_id)
VALUES 
('4159ebf0-8859-4128-915a-8274024adb5c', '4159ebf0-8859-4128-915a-8274024adb5c');

-- Seed data for topics table
INSERT INTO topics (name, slug)
VALUES 
('Art', 'art'),
('Design', 'design'),
('3D', '3d'),
('Illustration', 'illustration'),
('Digital Art', 'digital-art');

-- Seed data for posts table
INSERT INTO posts (title, content, topic_id, profile_id)
VALUES 
('Getting Started with Digital Art', 'Welcome to our digital art community! Share your work and connect with other artists.', 1, '4159ebf0-8859-4128-915a-8274024adb5c'),
('Design Tips for Beginners', 'Learn essential design principles and best practices for creating stunning visuals.', 2, '4159ebf0-8859-4128-915a-8274024adb5c'),
('3D Modeling Basics', 'Introduction to 3D modeling techniques and software recommendations.', 3, '4159ebf0-8859-4128-915a-8274024adb5c'),
('Illustration Techniques', 'Mastering illustration: tips and tricks for creating beautiful artwork.', 4, '4159ebf0-8859-4128-915a-8274024adb5c'),
('Digital Art Workflow', 'Optimizing your digital art creation process from start to finish.', 5, '4159ebf0-8859-4128-915a-8274024adb5c');

-- Seed data for post_replies table
INSERT INTO post_replies (post_id, profile_id, reply)
VALUES 
(1, '4159ebf0-8859-4128-915a-8274024adb5c', 'Thank you for checking out my portfolio!'),
(2, '4159ebf0-8859-4128-915a-8274024adb5c', 'I''m always open to new character design projects!'),
(3, '4159ebf0-8859-4128-915a-8274024adb5c', 'Current turnaround time is 7-10 days.'),
(4, '4159ebf0-8859-4128-915a-8274024adb5c', 'Portfolio tips coming soon!'),
(5, '4159ebf0-8859-4128-915a-8274024adb5c', 'Please read the guidelines carefully.');

-- Seed data for post_upvotes table (composite primary key)
INSERT INTO post_upvotes (post_id, profile_id)
VALUES 
(1, '4159ebf0-8859-4128-915a-8274024adb5c'),
(2, '4159ebf0-8859-4128-915a-8274024adb5c'),
(3, '4159ebf0-8859-4128-915a-8274024adb5c'),
(4, '4159ebf0-8859-4128-915a-8274024adb5c'),
(5, '4159ebf0-8859-4128-915a-8274024adb5c');

-- Seed data for reviews table
INSERT INTO reviews (title, description, rating, commission_id, artist_id, reviewer_id)
VALUES 
('Amazing Character Design', 'John did an incredible job with my character design...', 5, 1, 1, '4159ebf0-8859-4128-915a-8274024adb5c'),
('Detailed Illustration', 'The illustration exceeded my expectations...', 5, 2, 1, '4159ebf0-8859-4128-915a-8274024adb5c'),
('Professional 3D Model', 'Perfect 3D model for my game character...', 5, 3, 1, '4159ebf0-8859-4128-915a-8274024adb5c'),
('Live2D Creation', 'Smooth and responsive Live2D character...', 5, 4, 1, '4159ebf0-8859-4128-915a-8274024adb5c'),
('UI Design', 'Beautiful and functional UI design...', 5, 5, 1, '4159ebf0-8859-4128-915a-8274024adb5c');

-- Seed data for review_comments table
INSERT INTO review_comments (review_id, profile_id, comment)
VALUES 
(1, '4159ebf0-8859-4128-915a-8274024adb5c', 'Thank you for the great review!'),
(2, '4159ebf0-8859-4128-915a-8274024adb5c', 'Glad you liked the illustration!'),
(3, '4159ebf0-8859-4128-915a-8274024adb5c', 'Thanks for the 3D model feedback!'),
(4, '4159ebf0-8859-4128-915a-8274024adb5c', 'Appreciate the Live2D review!'),
(5, '4159ebf0-8859-4128-915a-8274024adb5c', 'Thank you for the UI design feedback!');

-- Seed data for review_likes table (composite primary key)
INSERT INTO review_likes (review_id, profile_id)
VALUES 
(1, '4159ebf0-8859-4128-915a-8274024adb5c'),
(2, '4159ebf0-8859-4128-915a-8274024adb5c'),
(3, '4159ebf0-8859-4128-915a-8274024adb5c'),
(4, '4159ebf0-8859-4128-915a-8274024adb5c'),
(5, '4159ebf0-8859-4128-915a-8274024adb5c');

-- Seed data for artist_follows table (composite primary key)
INSERT INTO artist_follows (artist_id, profile_id)
VALUES 
(1, '4159ebf0-8859-4128-915a-8274024adb5c');

-- Seed data for notifications table
INSERT INTO notifications (source_id, commission_id, target_id, type)
VALUES 
('4159ebf0-8859-4128-915a-8274024adb5c', 1, '4159ebf0-8859-4128-915a-8274024adb5c', 'commission_request'),
('4159ebf0-8859-4128-915a-8274024adb5c', 2, '4159ebf0-8859-4128-915a-8274024adb5c', 'commission_accepted'),
('4159ebf0-8859-4128-915a-8274024adb5c', 3, '4159ebf0-8859-4128-915a-8274024adb5c', 'commission_completed'),
('4159ebf0-8859-4128-915a-8274024adb5c', 4, '4159ebf0-8859-4128-915a-8274024adb5c', 'review'),
('4159ebf0-8859-4128-915a-8274024adb5c', 5, '4159ebf0-8859-4128-915a-8274024adb5c', 'mention');

-- Seed data for commission_order table
INSERT INTO commission_order (commission_id, client_id, artist_id, price_agreed, requirements)
VALUES 
(1, 1, 1, 150, 'Need a fantasy character design'),
(2, 1, 1, 200, 'Detailed illustration for book cover'),
(3, 1, 1, 250, '3D model for game character'),
(4, 1, 1, 300, 'Live2D character creation'),
(5, 1, 1, 180, 'UI design for mobile app');
