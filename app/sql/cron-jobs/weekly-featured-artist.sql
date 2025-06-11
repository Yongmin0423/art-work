-- 기존 featured 해제
UPDATE commission SET is_featured_weekly = false WHERE is_featured_weekly = true;

-- 새로운 featured 설정 (스마트 선정)
UPDATE commission 
SET is_featured_weekly = true
WHERE commission_id IN (
  SELECT commission_id 
  FROM commission 
  WHERE created_at >= NOW() - INTERVAL '60 days'
    AND status = 'available'
  ORDER BY (
    likes_count * 0.3 + 
    order_count * 0.4 + 
    views_count * 0.1 + 
    RANDOM() * 0.2
  ) DESC
  LIMIT 8
);