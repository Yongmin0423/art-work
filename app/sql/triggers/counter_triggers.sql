-- Counter update triggers for maintaining count fields

-- 1. Commission likes count trigger
CREATE OR REPLACE FUNCTION update_commission_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE commission 
        SET likes_count = likes_count + 1 
        WHERE commission_id = NEW.commission_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE commission 
        SET likes_count = likes_count - 1 
        WHERE commission_id = OLD.commission_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS commission_likes_count_trigger ON commission_like;
CREATE TRIGGER commission_likes_count_trigger
    AFTER INSERT OR DELETE ON commission_like
    FOR EACH ROW EXECUTE FUNCTION update_commission_likes_count();

-- 2. Post upvotes count trigger
CREATE OR REPLACE FUNCTION update_post_upvotes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts 
        SET upvotes_count = upvotes_count + 1 
        WHERE post_id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts 
        SET upvotes_count = upvotes_count - 1 
        WHERE post_id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS post_upvotes_count_trigger ON post_upvotes;
CREATE TRIGGER post_upvotes_count_trigger
    AFTER INSERT OR DELETE ON post_upvotes
    FOR EACH ROW EXECUTE FUNCTION update_post_upvotes_count();

-- 3. Post replies count trigger
CREATE OR REPLACE FUNCTION update_post_replies_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts 
        SET replies_count = replies_count + 1 
        WHERE post_id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts 
        SET replies_count = replies_count - 1 
        WHERE post_id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS post_replies_count_trigger ON post_replies;
CREATE TRIGGER post_replies_count_trigger
    AFTER INSERT OR DELETE ON post_replies
    FOR EACH ROW EXECUTE FUNCTION update_post_replies_count();

-- 4. Topic post count trigger
CREATE OR REPLACE FUNCTION update_topic_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE topics 
        SET post_count = post_count + 1 
        WHERE topic_id = NEW.topic_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE topics 
        SET post_count = post_count - 1 
        WHERE topic_id = OLD.topic_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- topic_id가 변경된 경우
        IF OLD.topic_id IS DISTINCT FROM NEW.topic_id THEN
            IF OLD.topic_id IS NOT NULL THEN
                UPDATE topics 
                SET post_count = post_count - 1 
                WHERE topic_id = OLD.topic_id;
            END IF;
            IF NEW.topic_id IS NOT NULL THEN
                UPDATE topics 
                SET post_count = post_count + 1 
                WHERE topic_id = NEW.topic_id;
            END IF;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS topic_post_count_trigger ON posts;
CREATE TRIGGER topic_post_count_trigger
    AFTER INSERT OR DELETE OR UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_topic_post_count();

-- 5. Commission order count trigger
CREATE OR REPLACE FUNCTION update_commission_order_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE commission 
        SET order_count = order_count + 1 
        WHERE commission_id = NEW.commission_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE commission 
        SET order_count = order_count - 1 
        WHERE commission_id = OLD.commission_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS commission_order_count_trigger ON commission_order;
CREATE TRIGGER commission_order_count_trigger
    AFTER INSERT OR DELETE ON commission_order
    FOR EACH ROW EXECUTE FUNCTION update_commission_order_count();

-- 6. Review likes count trigger
CREATE OR REPLACE FUNCTION update_review_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE reviews 
        SET likes_count = likes_count + 1 
        WHERE review_id = NEW.review_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE reviews 
        SET likes_count = likes_count - 1 
        WHERE review_id = OLD.review_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS review_likes_count_trigger ON review_likes;
CREATE TRIGGER review_likes_count_trigger
    AFTER INSERT OR DELETE ON review_likes
    FOR EACH ROW EXECUTE FUNCTION update_review_likes_count();

-- 7. Review comment likes count trigger
CREATE OR REPLACE FUNCTION update_review_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE review_comments 
        SET likes_count = likes_count + 1 
        WHERE comment_id = NEW.comment_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE review_comments 
        SET likes_count = likes_count - 1 
        WHERE comment_id = OLD.comment_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS review_comment_likes_count_trigger ON review_comment_likes;
CREATE TRIGGER review_comment_likes_count_trigger
    AFTER INSERT OR DELETE ON review_comment_likes
    FOR EACH ROW EXECUTE FUNCTION update_review_comment_likes_count();

-- 8. Follower/Following count triggers
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- 팔로워 수 증가
        UPDATE profiles 
        SET followers_count = followers_count + 1 
        WHERE profile_id = NEW.following_id;
        -- 팔로잉 수 증가
        UPDATE profiles 
        SET following_count = following_count + 1 
        WHERE profile_id = NEW.follower_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- 팔로워 수 감소
        UPDATE profiles 
        SET followers_count = followers_count - 1 
        WHERE profile_id = OLD.following_id;
        -- 팔로잉 수 감소
        UPDATE profiles 
        SET following_count = following_count - 1 
        WHERE profile_id = OLD.follower_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS follow_counts_trigger ON follows;
CREATE TRIGGER follow_counts_trigger
    AFTER INSERT OR DELETE ON follows
    FOR EACH ROW EXECUTE FUNCTION update_follow_counts(); 