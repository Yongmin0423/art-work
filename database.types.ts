export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      artist_portfolio: {
        Row: {
          artist_id: string
          category: string | null
          created_at: string
          description: string | null
          images: Json
          tags: Json
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          artist_id: string
          category?: string | null
          created_at?: string
          description?: string | null
          images?: Json
          tags?: Json
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          artist_id?: string
          category?: string | null
          created_at?: string
          description?: string | null
          images?: Json
          tags?: Json
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "artist_portfolio_artist_id_profiles_profile_id_fk"
            columns: ["artist_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      category_showcase: {
        Row: {
          alt_text: string
          created_at: string
          display_order: number
          image_url: string
          is_active: string
          showcase_id: string
          title: string
          updated_at: string
        }
        Insert: {
          alt_text: string
          created_at?: string
          display_order?: number
          image_url: string
          is_active?: string
          showcase_id?: string
          title: string
          updated_at?: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          display_order?: number
          image_url?: string
          is_active?: string
          showcase_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      commission: {
        Row: {
          artist_id: string
          base_size: string | null
          category: Database["public"]["Enums"]["commission_category"]
          commission_id: number
          created_at: string
          description: string
          likes_count: number
          order_count: number
          price_options: Json
          price_start: number
          revision_count: number
          status: Database["public"]["Enums"]["commission_status"]
          tags: Json
          title: string
          turnaround_days: number
          updated_at: string
          views_count: number
        }
        Insert: {
          artist_id: string
          base_size?: string | null
          category: Database["public"]["Enums"]["commission_category"]
          commission_id?: never
          created_at?: string
          description: string
          likes_count?: number
          order_count?: number
          price_options?: Json
          price_start: number
          revision_count?: number
          status?: Database["public"]["Enums"]["commission_status"]
          tags?: Json
          title: string
          turnaround_days: number
          updated_at?: string
          views_count?: number
        }
        Update: {
          artist_id?: string
          base_size?: string | null
          category?: Database["public"]["Enums"]["commission_category"]
          commission_id?: never
          created_at?: string
          description?: string
          likes_count?: number
          order_count?: number
          price_options?: Json
          price_start?: number
          revision_count?: number
          status?: Database["public"]["Enums"]["commission_status"]
          tags?: Json
          title?: string
          turnaround_days?: number
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "commission_artist_id_profiles_profile_id_fk"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      commission_like: {
        Row: {
          commission_id: number
          created_at: string
          profile_id: string
        }
        Insert: {
          commission_id: number
          created_at?: string
          profile_id: string
        }
        Update: {
          commission_id?: number
          created_at?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_like_commission_id_commission_commission_id_fk"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commission"
            referencedColumns: ["commission_id"]
          },
          {
            foreignKeyName: "commission_like_commission_id_commission_commission_id_fk"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commission_with_artist"
            referencedColumns: ["commission_id"]
          },
          {
            foreignKeyName: "commission_like_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      commission_order: {
        Row: {
          accepted_at: string | null
          artist_id: string
          client_id: string
          commission_id: number
          completed_at: string | null
          created_at: string
          deadline: string | null
          final_image_url: string | null
          order_id: number
          requirements: string | null
          revision_count_used: number
          selected_options: Json
          started_at: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_price: number
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          artist_id: string
          client_id: string
          commission_id: number
          completed_at?: string | null
          created_at?: string
          deadline?: string | null
          final_image_url?: string | null
          order_id?: never
          requirements?: string | null
          revision_count_used?: number
          selected_options?: Json
          started_at?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_price: number
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          artist_id?: string
          client_id?: string
          commission_id?: number
          completed_at?: string | null
          created_at?: string
          deadline?: string | null
          final_image_url?: string | null
          order_id?: never
          requirements?: string | null
          revision_count_used?: number
          selected_options?: Json
          started_at?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_order_artist_id_profiles_profile_id_fk"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "commission_order_client_id_profiles_profile_id_fk"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "commission_order_commission_id_commission_commission_id_fk"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commission"
            referencedColumns: ["commission_id"]
          },
          {
            foreignKeyName: "commission_order_commission_id_commission_commission_id_fk"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commission_with_artist"
            referencedColumns: ["commission_id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_profiles_profile_id_fk"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "follows_following_id_profiles_profile_id_fk"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      logo: {
        Row: {
          alt_text: string
          created_at: string
          image_url: string
          is_active: string
          logo_id: string
          title: string
          updated_at: string
        }
        Insert: {
          alt_text: string
          created_at?: string
          image_url: string
          is_active?: string
          logo_id?: string
          title: string
          updated_at?: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          image_url?: string
          is_active?: string
          logo_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      message_room_members: {
        Row: {
          is_active: boolean
          joined_at: string
          last_read_at: string | null
          message_room_id: number
          profile_id: string
        }
        Insert: {
          is_active?: boolean
          joined_at?: string
          last_read_at?: string | null
          message_room_id: number
          profile_id: string
        }
        Update: {
          is_active?: boolean
          joined_at?: string
          last_read_at?: string | null
          message_room_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_room_members_message_room_id_message_rooms_message_room"
            columns: ["message_room_id"]
            isOneToOne: false
            referencedRelation: "message_rooms"
            referencedColumns: ["message_room_id"]
          },
          {
            foreignKeyName: "message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      message_rooms: {
        Row: {
          created_at: string
          created_by: string | null
          message_room_id: number
          room_name: string | null
          room_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          message_room_id?: never
          room_name?: string | null
          room_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          message_room_id?: never
          room_name?: string | null
          room_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_rooms_created_by_profiles_profile_id_fk"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          is_deleted: boolean
          is_edited: boolean
          message_id: number
          message_room_id: number | null
          message_type: string
          sender_id: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          is_deleted?: boolean
          is_edited?: boolean
          message_id?: never
          message_room_id?: number | null
          message_type?: string
          sender_id?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          is_deleted?: boolean
          is_edited?: boolean
          message_id?: never
          message_room_id?: number | null
          message_type?: string
          sender_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_message_room_id_message_rooms_message_room_id_fk"
            columns: ["message_room_id"]
            isOneToOne: false
            referencedRelation: "message_rooms"
            referencedColumns: ["message_room_id"]
          },
          {
            foreignKeyName: "messages_sender_id_profiles_profile_id_fk"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          message: string | null
          notification_id: number
          read: boolean
          read_at: string | null
          reference_id: number | null
          source_id: string | null
          target_id: string
          title: string | null
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          created_at?: string
          message?: string | null
          notification_id?: never
          read?: boolean
          read_at?: string | null
          reference_id?: number | null
          source_id?: string | null
          target_id: string
          title?: string | null
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          created_at?: string
          message?: string | null
          notification_id?: never
          read?: boolean
          read_at?: string | null
          reference_id?: number | null
          source_id?: string | null
          target_id?: string
          title?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_source_id_profiles_profile_id_fk"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "notifications_target_id_profiles_profile_id_fk"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          from_status: Database["public"]["Enums"]["order_status"] | null
          history_id: number
          order_id: number
          reason: string | null
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["order_status"] | null
          history_id?: never
          order_id: number
          reason?: string | null
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["order_status"] | null
          history_id?: never
          order_id?: number
          reason?: string | null
          to_status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_changed_by_profiles_profile_id_fk"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "order_status_history_order_id_commission_order_order_id_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "commission_order"
            referencedColumns: ["order_id"]
          },
        ]
      }
      post_replies: {
        Row: {
          created_at: string
          parent_id: number | null
          post_id: number | null
          post_reply_id: number
          profile_id: string
          replies_count: number
          reply: string
          updated_at: string
          upvotes_count: number
        }
        Insert: {
          created_at?: string
          parent_id?: number | null
          post_id?: number | null
          post_reply_id?: never
          profile_id: string
          replies_count?: number
          reply: string
          updated_at?: string
          upvotes_count?: number
        }
        Update: {
          created_at?: string
          parent_id?: number | null
          post_id?: number | null
          post_reply_id?: never
          profile_id?: string
          replies_count?: number
          reply?: string
          updated_at?: string
          upvotes_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "post_replies_parent_id_post_replies_post_reply_id_fk"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "post_replies"
            referencedColumns: ["post_reply_id"]
          },
          {
            foreignKeyName: "post_replies_post_id_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_replies_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      post_reply_upvotes: {
        Row: {
          created_at: string
          post_reply_id: number
          profile_id: string
        }
        Insert: {
          created_at?: string
          post_reply_id: number
          profile_id: string
        }
        Update: {
          created_at?: string
          post_reply_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reply_upvotes_post_reply_id_post_replies_post_reply_id_fk"
            columns: ["post_reply_id"]
            isOneToOne: false
            referencedRelation: "post_replies"
            referencedColumns: ["post_reply_id"]
          },
          {
            foreignKeyName: "post_reply_upvotes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      post_upvotes: {
        Row: {
          created_at: string
          post_id: number
          profile_id: string
        }
        Insert: {
          created_at?: string
          post_id: number
          profile_id: string
        }
        Update: {
          created_at?: string
          post_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_upvotes_post_id_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_upvotes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          is_locked: boolean
          is_pinned: boolean
          post_id: number
          profile_id: string
          replies_count: number
          title: string
          topic_id: number
          updated_at: string
          upvotes_count: number
          views_count: number
        }
        Insert: {
          content: string
          created_at?: string
          is_locked?: boolean
          is_pinned?: boolean
          post_id?: never
          profile_id: string
          replies_count?: number
          title: string
          topic_id: number
          updated_at?: string
          upvotes_count?: number
          views_count?: number
        }
        Update: {
          content?: string
          created_at?: string
          is_locked?: boolean
          is_pinned?: boolean
          post_id?: never
          profile_id?: string
          replies_count?: number
          title?: string
          topic_id?: number
          updated_at?: string
          upvotes_count?: number
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "posts_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "posts_topic_id_topics_topic_id_fk"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["topic_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          followers_count: number
          following_count: number
          job_title: string | null
          location: string | null
          name: string
          profile_id: string
          updated_at: string
          username: string
          views_count: number
          website: string | null
          work_status: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          followers_count?: number
          following_count?: number
          job_title?: string | null
          location?: string | null
          name: string
          profile_id: string
          updated_at?: string
          username: string
          views_count?: number
          website?: string | null
          work_status?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          followers_count?: number
          following_count?: number
          job_title?: string | null
          location?: string | null
          name?: string
          profile_id?: string
          updated_at?: string
          username?: string
          views_count?: number
          website?: string | null
          work_status?: string
        }
        Relationships: []
      }
      review_comment_likes: {
        Row: {
          comment_id: number
          created_at: string
          profile_id: string
        }
        Insert: {
          comment_id: number
          created_at?: string
          profile_id: string
        }
        Update: {
          comment_id?: number
          created_at?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_comment_likes_comment_id_review_comments_comment_id_fk"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "review_comments"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "review_comment_likes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      review_comments: {
        Row: {
          comment: string
          comment_id: number
          created_at: string
          likes_count: number
          parent_id: number | null
          profile_id: string
          review_id: number
          updated_at: string
        }
        Insert: {
          comment: string
          comment_id?: never
          created_at?: string
          likes_count?: number
          parent_id?: number | null
          profile_id: string
          review_id: number
          updated_at?: string
        }
        Update: {
          comment?: string
          comment_id?: never
          created_at?: string
          likes_count?: number
          parent_id?: number | null
          profile_id?: string
          review_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_comments_parent_id_review_comments_comment_id_fk"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "review_comments"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "review_comments_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "review_comments_review_id_reviews_review_id_fk"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["review_id"]
          },
        ]
      }
      review_likes: {
        Row: {
          created_at: string
          profile_id: string
          review_id: number
        }
        Insert: {
          created_at?: string
          profile_id: string
          review_id: number
        }
        Update: {
          created_at?: string
          profile_id?: string
          review_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "review_likes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "review_likes_review_id_reviews_review_id_fk"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["review_id"]
          },
        ]
      }
      reviews: {
        Row: {
          artist_id: string
          commission_id: number
          created_at: string
          description: string
          image_url: string | null
          is_featured: boolean
          likes_count: number
          order_id: number
          rating: number
          review_id: number
          reviewer_id: string
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          artist_id: string
          commission_id: number
          created_at?: string
          description: string
          image_url?: string | null
          is_featured?: boolean
          likes_count?: number
          order_id: number
          rating: number
          review_id?: never
          reviewer_id: string
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          artist_id?: string
          commission_id?: number
          created_at?: string
          description?: string
          image_url?: string | null
          is_featured?: boolean
          likes_count?: number
          order_id?: number
          rating?: number
          review_id?: never
          reviewer_id?: string
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_artist_id_profiles_profile_id_fk"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "reviews_commission_id_commission_commission_id_fk"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commission"
            referencedColumns: ["commission_id"]
          },
          {
            foreignKeyName: "reviews_commission_id_commission_commission_id_fk"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commission_with_artist"
            referencedColumns: ["commission_id"]
          },
          {
            foreignKeyName: "reviews_order_id_commission_order_order_id_fk"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "commission_order"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_profiles_profile_id_fk"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string
          description: string | null
          name: string
          post_count: number
          slug: string
          topic_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          name: string
          post_count?: number
          slug: string
          topic_id?: never
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          name?: string
          post_count?: number
          slug?: string
          topic_id?: never
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      commission_with_artist: {
        Row: {
          artist_avatar_url: string | null
          artist_avg_rating: number | null
          artist_bio: string | null
          artist_followers_count: number | null
          artist_following_count: number | null
          artist_id: string | null
          artist_job_title: string | null
          artist_location: string | null
          artist_name: string | null
          artist_username: string | null
          artist_views_count: number | null
          artist_website: string | null
          artist_work_status: string | null
          base_size: string | null
          category: Database["public"]["Enums"]["commission_category"] | null
          commission_id: number | null
          created_at: string | null
          description: string | null
          images: Json | null
          likes_count: number | null
          order_count: number | null
          price_options: Json | null
          price_start: number | null
          revision_count: number | null
          status: Database["public"]["Enums"]["commission_status"] | null
          tags: Json | null
          title: string | null
          turnaround_days: number | null
          updated_at: string | null
          views_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_artist_id_profiles_profile_id_fk"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      commission_category:
        | "character"
        | "illustration"
        | "virtual-3d"
        | "live2d"
        | "design"
        | "video"
        | "animation"
        | "concept-art"
      commission_status: "available" | "pending" | "unavailable" | "paused"
      notification_type:
        | "follow"
        | "commission_request"
        | "commission_accepted"
        | "commission_completed"
        | "review"
        | "reply"
        | "mention"
        | "commission_like"
        | "review_like"
        | "post_upvote"
        | "post_reply"
      order_status:
        | "pending"
        | "accepted"
        | "in_progress"
        | "revision_requested"
        | "completed"
        | "cancelled"
        | "refunded"
        | "disputed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      commission_category: [
        "character",
        "illustration",
        "virtual-3d",
        "live2d",
        "design",
        "video",
        "animation",
        "concept-art",
      ],
      commission_status: ["available", "pending", "unavailable", "paused"],
      notification_type: [
        "follow",
        "commission_request",
        "commission_accepted",
        "commission_completed",
        "review",
        "reply",
        "mention",
        "commission_like",
        "review_like",
        "post_upvote",
        "post_reply",
      ],
      order_status: [
        "pending",
        "accepted",
        "in_progress",
        "revision_requested",
        "completed",
        "cancelled",
        "refunded",
        "disputed",
      ],
    },
  },
} as const
