ALTER TABLE "artist_portfolio" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "follows" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "message_room_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "message_rooms" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "artist-portfolio-select-policy" ON "artist_portfolio" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "artist-portfolio-insert-policy" ON "artist_portfolio" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "artist-portfolio-update-policy" ON "artist_portfolio" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (profile_id = auth.uid()::uuid) WITH CHECK (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "artist-portfolio-delete-policy" ON "artist_portfolio" AS PERMISSIVE FOR DELETE TO "authenticated" USING (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "follows-select-policy" ON "follows" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "follows-insert-policy" ON "follows" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (follower_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "follows-delete-policy" ON "follows" AS PERMISSIVE FOR DELETE TO "authenticated" USING (follower_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "message-room-members-select-policy" ON "message_room_members" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM message_room_members mrm 
        WHERE mrm.message_room_id = message_room_members.message_room_id 
        AND mrm.profile_id = auth.uid()::uuid 
        AND mrm.is_active = true
      ));--> statement-breakpoint
CREATE POLICY "message-room-members-insert-policy" ON "message_room_members" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (profile_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM message_rooms 
        WHERE message_room_id = message_room_members.message_room_id 
        AND created_by = auth.uid()::uuid
      ));--> statement-breakpoint
CREATE POLICY "message-room-members-update-policy" ON "message_room_members" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (profile_id = auth.uid()::uuid) WITH CHECK (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "message-room-members-delete-policy" ON "message_room_members" AS PERMISSIVE FOR DELETE TO "authenticated" USING (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "message-rooms-select-policy" ON "message_rooms" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM message_room_members 
        WHERE message_room_id = message_rooms.message_room_id 
        AND profile_id = auth.uid()::uuid 
        AND is_active = true
      ));--> statement-breakpoint
CREATE POLICY "message-rooms-insert-policy" ON "message_rooms" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.uid() IS NOT NULL);--> statement-breakpoint
CREATE POLICY "message-rooms-update-policy" ON "message_rooms" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (created_by = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      )) WITH CHECK (created_by = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      ));--> statement-breakpoint
CREATE POLICY "message-rooms-delete-policy" ON "message_rooms" AS PERMISSIVE FOR DELETE TO "authenticated" USING (created_by = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      ));--> statement-breakpoint
CREATE POLICY "messages-select-policy" ON "messages" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM message_room_members 
        WHERE message_room_id = messages.message_room_id 
        AND profile_id = auth.uid()::uuid 
        AND is_active = true
      ));--> statement-breakpoint
CREATE POLICY "messages-insert-policy" ON "messages" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (sender_id = auth.uid()::uuid AND EXISTS (
        SELECT 1 FROM message_room_members 
        WHERE message_room_id = messages.message_room_id 
        AND profile_id = auth.uid()::uuid 
        AND is_active = true
      ));--> statement-breakpoint
CREATE POLICY "messages-update-policy" ON "messages" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (sender_id = auth.uid()::uuid) WITH CHECK (sender_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "messages-delete-policy" ON "messages" AS PERMISSIVE FOR DELETE TO "authenticated" USING (sender_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      ));--> statement-breakpoint
CREATE POLICY "notifications-select-policy" ON "notifications" AS PERMISSIVE FOR SELECT TO "authenticated" USING (target_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "notifications-insert-policy" ON "notifications" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.uid() IS NOT NULL);--> statement-breakpoint
CREATE POLICY "notifications-update-policy" ON "notifications" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (target_id = auth.uid()::uuid) WITH CHECK (target_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "notifications-delete-policy" ON "notifications" AS PERMISSIVE FOR DELETE TO "authenticated" USING (target_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "profiles-select-policy" ON "profiles" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "profiles-insert-policy" ON "profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "profiles-update-policy" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (profile_id = auth.uid()::uuid) WITH CHECK (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "profiles-delete-policy" ON "profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING (profile_id = auth.uid()::uuid);