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
      artist: {
        Row: {
          artist_id: number
          bio: string | null
          created_at: string
          email: string
          name: string
          profile_image: string | null
          social_links: Json | null
        }
        Insert: {
          artist_id?: never
          bio?: string | null
          created_at?: string
          email: string
          name: string
          profile_image?: string | null
          social_links?: Json | null
        }
        Update: {
          artist_id?: never
          bio?: string | null
          created_at?: string
          email?: string
          name?: string
          profile_image?: string | null
          social_links?: Json | null
        }
        Relationships: []
      }
      artist_follows: {
        Row: {
          artist_id: number
          created_at: string
          profile_id: string
        }
        Insert: {
          artist_id: number
          created_at?: string
          profile_id: string
        }
        Update: {
          artist_id?: number
          created_at?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_follows_artist_id_artist_artist_id_fk"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["artist_id"]
          },
          {
            foreignKeyName: "artist_follows_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      commission: {
        Row: {
          artist_id: number | null
          category: Database["public"]["Enums"]["commission_category"]
          commission_id: number
          created_at: string
          currency: string
          description: string
          image: Json
          likes_count: number
          name: string
          price_end: number | null
          price_start: number
          rating_avg: number | null
          rating_count: number
          revision_count: number | null
          status: Database["public"]["Enums"]["commission_status"]
          tags: Json
          turnaround_days: number | null
          updated_at: string
        }
        Insert: {
          artist_id?: number | null
          category: Database["public"]["Enums"]["commission_category"]
          commission_id?: never
          created_at?: string
          currency?: string
          description: string
          image?: Json
          likes_count?: number
          name: string
          price_end?: number | null
          price_start: number
          rating_avg?: number | null
          rating_count?: number
          revision_count?: number | null
          status: Database["public"]["Enums"]["commission_status"]
          tags?: Json
          turnaround_days?: number | null
          updated_at?: string
        }
        Update: {
          artist_id?: number | null
          category?: Database["public"]["Enums"]["commission_category"]
          commission_id?: never
          created_at?: string
          currency?: string
          description?: string
          image?: Json
          likes_count?: number
          name?: string
          price_end?: number | null
          price_start?: number
          rating_avg?: number | null
          rating_count?: number
          revision_count?: number | null
          status?: Database["public"]["Enums"]["commission_status"]
          tags?: Json
          turnaround_days?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_artist_id_artist_artist_id_fk"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["artist_id"]
          },
        ]
      }
      commission_order: {
        Row: {
          artist_id: number | null
          client_id: number | null
          commission_id: number | null
          completed_at: string | null
          created_at: string
          order_id: number
          price_agreed: number
          requirements: string | null
        }
        Insert: {
          artist_id?: number | null
          client_id?: number | null
          commission_id?: number | null
          completed_at?: string | null
          created_at?: string
          order_id?: never
          price_agreed: number
          requirements?: string | null
        }
        Update: {
          artist_id?: number | null
          client_id?: number | null
          commission_id?: number | null
          completed_at?: string | null
          created_at?: string
          order_id?: never
          price_agreed?: number
          requirements?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_order_artist_id_artist_artist_id_fk"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["artist_id"]
          },
          {
            foreignKeyName: "commission_order_commission_id_commission_commission_id_fk"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commission"
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
      message_room_members: {
        Row: {
          joined_at: string
          last_read_at: string | null
          message_room_id: number
          profile_id: string
        }
        Insert: {
          joined_at?: string
          last_read_at?: string | null
          message_room_id: number
          profile_id: string
        }
        Update: {
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
          message_room_id: number
        }
        Insert: {
          created_at?: string
          message_room_id?: never
        }
        Update: {
          created_at?: string
          message_room_id?: never
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          message_id: number
          message_room_id: number | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          message_id?: never
          message_room_id?: number | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          message_id?: never
          message_room_id?: number | null
          sender_id?: string | null
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
          commission_id: number | null
          created_at: string
          notification_id: number
          post_id: number | null
          read: string | null
          source_id: string | null
          target_id: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          commission_id?: number | null
          created_at?: string
          notification_id?: never
          post_id?: number | null
          read?: string | null
          source_id?: string | null
          target_id: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          commission_id?: number | null
          created_at?: string
          notification_id?: never
          post_id?: number | null
          read?: string | null
          source_id?: string | null
          target_id?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_commission_id_commission_commission_id_fk"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commission"
            referencedColumns: ["commission_id"]
          },
          {
            foreignKeyName: "notifications_post_id_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
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
      post_replies: {
        Row: {
          created_at: string
          parent_id: number | null
          post_id: number | null
          post_reply_id: number
          profile_id: string
          reply: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          parent_id?: number | null
          post_id?: number | null
          post_reply_id?: never
          profile_id: string
          reply: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          parent_id?: number | null
          post_id?: number | null
          post_reply_id?: never
          profile_id?: string
          reply?: string
          updated_at?: string
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
      post_upvotes: {
        Row: {
          post_id: number
          profile_id: string
        }
        Insert: {
          post_id: number
          profile_id: string
        }
        Update: {
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
          post_id: number
          profile_id: string | null
          title: string
          topic_id: number | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          post_id?: never
          profile_id?: string | null
          title: string
          topic_id?: number | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          post_id?: never
          profile_id?: string | null
          title?: string
          topic_id?: number | null
          updated_at?: string
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
          job_title: string | null
          location: string | null
          name: string
          profile_id: string
          stats: Json | null
          updated_at: string
          username: string
          website: string | null
          work_status: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          job_title?: string | null
          location?: string | null
          name: string
          profile_id: string
          stats?: Json | null
          updated_at?: string
          username: string
          website?: string | null
          work_status?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          job_title?: string | null
          location?: string | null
          name?: string
          profile_id?: string
          stats?: Json | null
          updated_at?: string
          username?: string
          website?: string | null
          work_status?: string
        }
        Relationships: []
      }
      review_comments: {
        Row: {
          comment: string
          comment_id: number
          created_at: string
          parent_id: number | null
          profile_id: string
          review_id: number
          updated_at: string
        }
        Insert: {
          comment: string
          comment_id?: never
          created_at?: string
          parent_id?: number | null
          profile_id: string
          review_id: number
          updated_at?: string
        }
        Update: {
          comment?: string
          comment_id?: never
          created_at?: string
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
          artist_id: number
          commission_id: number | null
          created_at: string
          description: string
          image_url: string | null
          rating: number
          review_id: number
          reviewer_id: string
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          artist_id: number
          commission_id?: number | null
          created_at?: string
          description: string
          image_url?: string | null
          rating: number
          review_id?: never
          reviewer_id: string
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          artist_id?: number
          commission_id?: number | null
          created_at?: string
          description?: string
          image_url?: string | null
          rating?: number
          review_id?: never
          reviewer_id?: string
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_artist_id_artist_artist_id_fk"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["artist_id"]
          },
          {
            foreignKeyName: "reviews_commission_id_commission_commission_id_fk"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commission"
            referencedColumns: ["commission_id"]
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
          name: string
          slug: string
          topic_id: number
        }
        Insert: {
          created_at?: string
          name: string
          slug: string
          topic_id?: never
        }
        Update: {
          created_at?: string
          name?: string
          slug?: string
          topic_id?: never
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
      commission_status: "available" | "pending" | "unavailable"
      notification_type:
        | "follow"
        | "commission_request"
        | "commission_accepted"
        | "commission_completed"
        | "review"
        | "reply"
        | "mention"
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
      ],
      commission_status: ["available", "pending", "unavailable"],
      notification_type: [
        "follow",
        "commission_request",
        "commission_accepted",
        "commission_completed",
        "review",
        "reply",
        "mention",
      ],
    },
  },
} as const
