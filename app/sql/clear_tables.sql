-- Clear all table data and reset sequences
-- Run this before running seed.sql

TRUNCATE TABLE 
  follows,
  messages,
  message_room_members,
  message_rooms,
  review_comments,
  reviews,
  post_replies,
  post_upvotes,
  commission_like,
  order_status_history,
  commission_order,
  artist_portfolio,
  commission,
  posts,
  topics
RESTART IDENTITY CASCADE; 