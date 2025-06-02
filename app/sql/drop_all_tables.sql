-- Drop all tables and types to start fresh

-- Drop all views first
DROP VIEW IF EXISTS commission_with_artist CASCADE;

-- Drop all tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS message_room_members CASCADE;
DROP TABLE IF EXISTS message_rooms CASCADE;
DROP TABLE IF EXISTS review_comment_likes CASCADE;
DROP TABLE IF EXISTS review_comments CASCADE;
DROP TABLE IF EXISTS review_likes CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS post_reply_upvotes CASCADE;
DROP TABLE IF EXISTS post_replies CASCADE;
DROP TABLE IF EXISTS post_upvotes CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS commission_like CASCADE;
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS commission_order CASCADE;
DROP TABLE IF EXISTS commission CASCADE;
DROP TABLE IF EXISTS artist_portfolio CASCADE;
DROP TABLE IF EXISTS portfolio_item CASCADE;
DROP TABLE IF EXISTS commission_portfolio CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop all custom types
DROP TYPE IF EXISTS commission_category CASCADE;
DROP TYPE IF EXISTS commission_status CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;

-- Drop all sequences (they will be recreated automatically)
DROP SEQUENCE IF EXISTS commission_commission_id_seq CASCADE;
DROP SEQUENCE IF EXISTS commission_order_order_id_seq CASCADE;
DROP SEQUENCE IF EXISTS order_status_history_history_id_seq CASCADE;
DROP SEQUENCE IF EXISTS post_replies_post_reply_id_seq CASCADE;
DROP SEQUENCE IF EXISTS posts_post_id_seq CASCADE;
DROP SEQUENCE IF EXISTS topics_topic_id_seq CASCADE;
DROP SEQUENCE IF EXISTS review_comments_comment_id_seq CASCADE;
DROP SEQUENCE IF EXISTS reviews_review_id_seq CASCADE;
DROP SEQUENCE IF EXISTS message_rooms_message_room_id_seq CASCADE;
DROP SEQUENCE IF EXISTS messages_message_id_seq CASCADE; 