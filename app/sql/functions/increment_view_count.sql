-- 조회수 증가 RPC 함수
CREATE OR REPLACE FUNCTION increment_view_count(
  table_name text,
  record_id integer,
  id_column text DEFAULT 'id'
)
RETURNS void AS $$
BEGIN
  -- 동적 SQL로 조회수 증가
  EXECUTE format('UPDATE %I SET views_count = views_count + 1 WHERE %I = $1', table_name, id_column)
  USING record_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- profile의 경우 id가 UUID이므로 별도 함수
CREATE OR REPLACE FUNCTION increment_profile_view_count(
  profile_id_param uuid
)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET views_count = views_count + 1 
  WHERE profile_id = profile_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 