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
      activity_feed: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          metadata: Json | null
          product_id: string | null
          review_id: string | null
          sitter_id: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          product_id?: string | null
          review_id?: string | null
          sitter_id?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          product_id?: string | null
          review_id?: string | null
          sitter_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_feed_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_feed_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_feed_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "sitters"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          id: string
          reason: string | null
          target_id: string
          timestamp: string
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          id?: string
          reason?: string | null
          target_id: string
          timestamp?: string
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          id?: string
          reason?: string | null
          target_id?: string
          timestamp?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      flagged_content: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          reason: string
          reported_by_user_id: string
          resolved_at: string | null
          resolved_by_admin_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          reason: string
          reported_by_user_id: string
          resolved_at?: string | null
          resolved_by_admin_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          reason?: string
          reported_by_user_id?: string
          resolved_at?: string | null
          resolved_by_admin_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      follow_requests: {
        Row: {
          created_at: string
          id: string
          requestee_id: string
          requester_id: string
          status: Database["public"]["Enums"]["follow_request_status_enum"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          requestee_id: string
          requester_id: string
          status?: Database["public"]["Enums"]["follow_request_status_enum"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          requestee_id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["follow_request_status_enum"]
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          average_rating: number | null
          brand_name: string
          category: string | null
          category_id: string
          created_at: string
          created_by_user_id: string | null
          description: string | null
          external_purchase_link: string | null
          id: string
          image_url: string | null
          image_urls: string[] | null
          is_verified: boolean
          name: string
          price: number | null
          review_count: number | null
          updated_at: string
        }
        Insert: {
          average_rating?: number | null
          brand_name: string
          category?: string | null
          category_id: string
          created_at?: string
          created_by_user_id?: string | null
          description?: string | null
          external_purchase_link?: string | null
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          is_verified?: boolean
          name: string
          price?: number | null
          review_count?: number | null
          updated_at?: string
        }
        Update: {
          average_rating?: number | null
          brand_name?: string
          category?: string | null
          category_id?: string
          created_at?: string
          created_by_user_id?: string | null
          description?: string | null
          external_purchase_link?: string | null
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          is_verified?: boolean
          name?: string
          price?: number | null
          review_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_products_category_id"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          first_name: string
          full_name: string
          id: string
          identity_tag: string | null
          is_suspended: boolean
          last_activity_feed_view_at: string | null
          last_alerts_viewed_at: string | null
          last_login_at: string | null
          last_name: string
          phone_number: string | null
          phone_number_searchable: boolean
          profile_privacy_setting: Database["public"]["Enums"]["profile_privacy_enum"]
          role: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name: string
          full_name: string
          id: string
          identity_tag?: string | null
          is_suspended?: boolean
          last_activity_feed_view_at?: string | null
          last_alerts_viewed_at?: string | null
          last_login_at?: string | null
          last_name: string
          phone_number?: string | null
          phone_number_searchable?: boolean
          profile_privacy_setting?: Database["public"]["Enums"]["profile_privacy_enum"]
          role?: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string
          full_name?: string
          id?: string
          identity_tag?: string | null
          is_suspended?: boolean
          last_activity_feed_view_at?: string | null
          last_alerts_viewed_at?: string | null
          last_login_at?: string | null
          last_name?: string
          phone_number?: string | null
          phone_number_searchable?: boolean
          profile_privacy_setting?: Database["public"]["Enums"]["profile_privacy_enum"]
          role?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          identifier: string
          request_count: number
          request_type: string
          updated_at: string
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          identifier: string
          request_count?: number
          request_type: string
          updated_at?: string
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          identifier?: string
          request_count?: number
          request_type?: string
          updated_at?: string
          window_start?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string
          created_at: string
          has_verified_experience: boolean
          id: string
          product_id: string | null
          rating: number
          service_location_id: string | null
          sitter_id: string | null
          title: string
          updated_at: string
          user_id: string
          worked_with_sitter_certification: boolean
        }
        Insert: {
          content: string
          created_at?: string
          has_verified_experience: boolean
          id?: string
          product_id?: string | null
          rating: number
          service_location_id?: string | null
          sitter_id?: string | null
          title: string
          updated_at?: string
          user_id: string
          worked_with_sitter_certification?: boolean
        }
        Update: {
          content?: string
          created_at?: string
          has_verified_experience?: boolean
          id?: string
          product_id?: string | null
          rating?: number
          service_location_id?: string | null
          sitter_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          worked_with_sitter_certification?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_service_location_id_fkey"
            columns: ["service_location_id"]
            isOneToOne: false
            referencedRelation: "user_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "sitters"
            referencedColumns: ["id"]
          },
        ]
      }
      sitters: {
        Row: {
          bio: string | null
          certifications: string[] | null
          created_at: string
          created_by_user_id: string | null
          email: string | null
          experience: string | null
          hourly_rate: number | null
          id: string
          is_verified: boolean
          name: string
          phone_number: string | null
          phone_number_searchable: boolean
          profile_image_url: string | null
          rating: number | null
          review_count: number | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          created_by_user_id?: string | null
          email?: string | null
          experience?: string | null
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean
          name: string
          phone_number?: string | null
          phone_number_searchable?: boolean
          profile_image_url?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          created_by_user_id?: string | null
          email?: string | null
          experience?: string | null
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean
          name?: string
          phone_number?: string | null
          phone_number_searchable?: boolean
          profile_image_url?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_locations: {
        Row: {
          address_details: Json | null
          building_identifier: string | null
          created_at: string
          dwelling_type: Database["public"]["Enums"]["dwelling_type_enum"]
          google_place_id: string | null
          id: string
          is_primary: boolean | null
          latitude: number | null
          location_nickname: string
          longitude: number | null
          standardized_address: string | null
          updated_at: string
          user_id: string
          zip_code: string
        }
        Insert: {
          address_details?: Json | null
          building_identifier?: string | null
          created_at?: string
          dwelling_type?: Database["public"]["Enums"]["dwelling_type_enum"]
          google_place_id?: string | null
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          location_nickname: string
          longitude?: number | null
          standardized_address?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string
        }
        Update: {
          address_details?: Json | null
          building_identifier?: string | null
          created_at?: string
          dwelling_type?: Database["public"]["Enums"]["dwelling_type_enum"]
          google_place_id?: string | null
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          location_nickname?: string
          longitude?: number | null
          standardized_address?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_favorite: {
        Args: { p_item_id: string; p_item_type: string }
        Returns: Json
      }
      admin_delete_product: {
        Args: { target_product_id: string; deletion_reason?: string }
        Returns: Json
      }
      admin_delete_review: {
        Args: { review_id: string; deletion_reason?: string }
        Returns: Json
      }
      admin_delete_sitter: {
        Args: { target_sitter_id: string; deletion_reason?: string }
        Returns: Json
      }
      admin_delete_user: {
        Args: { target_user_id: string; deletion_reason?: string }
        Returns: Json
      }
      admin_get_all_products: {
        Args: {
          search_term?: string
          page_limit?: number
          page_offset?: number
        }
        Returns: {
          id: string
          name: string
          brand_name: string
          category: string
          description: string
          image_url: string
          price: number
          external_purchase_link: string
          average_rating: number
          review_count: number
          is_verified: boolean
          created_at: string
          updated_at: string
        }[]
      }
      admin_get_all_sitters: {
        Args: {
          search_term?: string
          page_limit?: number
          page_offset?: number
        }
        Returns: {
          id: string
          name: string
          profile_image_url: string
          bio: string
          experience: string
          hourly_rate: number
          phone_number: string
          email: string
          certifications: string[]
          rating: number
          review_count: number
          is_verified: boolean
          created_at: string
          updated_at: string
        }[]
      }
      admin_get_flagged_content: {
        Args: { p_status?: string; p_limit?: number; p_offset?: number }
        Returns: {
          flag_id: string
          content_type: string
          content_id: string
          reported_by_user_id: string
          reporter_name: string
          reason: string
          status: string
          created_at: string
          content_data: Json
        }[]
      }
      admin_get_item_reviews: {
        Args: { item_type: string; item_id: string }
        Returns: {
          id: string
          user_id: string
          user_full_name: string
          rating: number
          title: string
          content: string
          created_at: string
          updated_at: string
        }[]
      }
      admin_get_users: {
        Args: {
          search_term?: string
          page_limit?: number
          page_offset?: number
        }
        Returns: {
          id: string
          full_name: string
          username: string
          email: string
          phone_number: string
          role: string
          is_suspended: boolean
          created_at: string
          last_login_at: string
        }[]
      }
      admin_merge_duplicates: {
        Args: {
          item_type: string
          source_id: string
          target_id: string
          merge_reason?: string
        }
        Returns: Json
      }
      admin_resolve_flag: {
        Args: { p_flag_id: string; p_action: string; p_reason?: string }
        Returns: Json
      }
      admin_set_verified_status: {
        Args: { item_type: string; item_id: string; verified_status: boolean }
        Returns: Json
      }
      admin_suspend_user: {
        Args: { target_user_id: string; suspend_reason?: string }
        Returns: Json
      }
      admin_update_product_details: {
        Args: {
          target_product_id: string
          new_name?: string
          new_brand_name?: string
          new_category?: string
          new_description?: string
          new_image_url?: string
          new_price?: number
          new_external_purchase_link?: string
        }
        Returns: Json
      }
      admin_update_sitter_details: {
        Args: {
          target_sitter_id: string
          new_name?: string
          new_profile_image_url?: string
          new_bio?: string
          new_experience?: string
          new_hourly_rate?: number
          new_phone_number?: string
          new_email?: string
          new_certifications?: string[]
        }
        Returns: Json
      }
      check_rate_limit: {
        Args: {
          p_identifier: string
          p_endpoint: string
          p_request_type: string
          p_max_requests: number
          p_window_minutes: number
        }
        Returns: boolean
      }
      cleanup_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_follow_relationship: {
        Args: { p_follower_id: string; p_following_id: string }
        Returns: undefined
      }
      create_review: {
        Args: {
          p_sitter_id: string
          p_service_location_id: string
          p_rating: number
          p_title: string
          p_content: string
          p_certification_checkbox_value: boolean
          p_product_id?: string
        }
        Returns: Json
      }
      flag_content: {
        Args: { p_content_type: string; p_content_id: string; p_reason: string }
        Returns: Json
      }
      get_follow_status: {
        Args: { target_user_id: string }
        Returns: string
      }
      get_friends_activity_feed: {
        Args: { p_current_user_id: string; p_limit?: number; p_offset?: number }
        Returns: {
          activity_id: string
          activity_type: string
          actor_id: string
          actor_full_name: string
          actor_avatar_url: string
          activity_timestamp: string
          item_id: string
          item_name: string
          item_image_url: string
          item_category: string
          review_rating: number
          review_title: string
        }[]
      }
      get_local_sitters: {
        Args: {
          current_user_id_param: string
          selected_user_location_id_param: string
          search_scope_param: string
        }
        Returns: {
          bio: string | null
          certifications: string[] | null
          created_at: string
          created_by_user_id: string | null
          email: string | null
          experience: string | null
          hourly_rate: number | null
          id: string
          is_verified: boolean
          name: string
          phone_number: string | null
          phone_number_searchable: boolean
          profile_image_url: string | null
          rating: number | null
          review_count: number | null
          updated_at: string
        }[]
      }
      get_new_activity_count: {
        Args: { user_id: string }
        Returns: number
      }
      get_new_alerts_status: {
        Args: { user_id: string }
        Returns: Json
      }
      get_newly_recommended_products_from_followed_users: {
        Args: { p_current_user_id: string; p_limit?: number; p_offset?: number }
        Returns: {
          product_id: string
          product_name: string
          product_image_url: string
          product_category: string
          recommendation_rating: number
          recommender_user_id: string
          recommender_full_name: string
          recommender_avatar_url: string
          recommendation_timestamp: string
        }[]
      }
      get_newly_recommended_sitters_from_followed_users: {
        Args: { p_current_user_id: string; p_limit?: number; p_offset?: number }
        Returns: {
          sitter_id: string
          sitter_name: string
          sitter_profile_image_url: string
          sitter_rating: number
          recommender_user_id: string
          recommender_full_name: string
          recommender_avatar_url: string
          recommendation_timestamp: string
        }[]
      }
      get_profile_followers: {
        Args: { target_user_id: string }
        Returns: {
          id: string
          full_name: string
          avatar_url: string
        }[]
      }
      get_profile_following: {
        Args: { target_user_id: string }
        Returns: {
          id: string
          full_name: string
          avatar_url: string
        }[]
      }
      get_profile_with_follow_status: {
        Args: { target_user_id: string }
        Returns: Json
      }
      get_recent_activity_summary: {
        Args: { user_id: string }
        Returns: {
          activity_count: number
          most_recent_user_name: string
          most_recent_activity: string
        }[]
      }
      get_suggested_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          full_name: string
          username: string
          avatar_url: string
          profile_privacy_setting: Database["public"]["Enums"]["profile_privacy_enum"]
          follow_status: string
          mutual_connections_count: number
        }[]
      }
      get_top_community_picks: {
        Args: {
          time_window_days?: number
          min_recommendation_rating?: number
          limit_results?: number
        }
        Returns: {
          product_id: string
          product_name: string
          product_image_url: string
          product_category: string
          average_rating: number
          unique_recommender_count: number
        }[]
      }
      get_user_recommendations_with_review_snippets: {
        Args: { profile_owner_user_id: string; item_type: string }
        Returns: Json
      }
      mark_alerts_as_viewed: {
        Args: { user_id: string }
        Returns: undefined
      }
      remove_favorite: {
        Args: { p_item_id: string; p_item_type: string }
        Returns: Json
      }
      search_all_profiles: {
        Args: { search_term: string }
        Returns: {
          id: string
          full_name: string
          username: string
          avatar_url: string
          profile_privacy_setting: Database["public"]["Enums"]["profile_privacy_enum"]
          follow_status: string
          similarity_score: number
        }[]
      }
      search_profile_by_phone: {
        Args: { search_phone: string }
        Returns: {
          id: string
          full_name: string
          username: string
          avatar_url: string
          profile_privacy_setting: Database["public"]["Enums"]["profile_privacy_enum"]
        }[]
      }
      search_profile_by_phone_secure: {
        Args: { search_phone: string }
        Returns: {
          id: string
          full_name: string
          username: string
          avatar_url: string
          profile_privacy_setting: Database["public"]["Enums"]["profile_privacy_enum"]
        }[]
      }
      search_sitters: {
        Args: { home_place_id: string; current_user_id?: string }
        Returns: {
          id: string
          name: string
          profile_image_url: string
          rating: number
          experience: string
          bio: string
          hourly_rate: number
          certifications: string[]
          phone_number: string
          email: string
          review_count: number
          created_at: string
          updated_at: string
        }[]
      }
      update_activity_feed_view: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_review: {
        Args: {
          p_review_id: string
          p_new_rating: number
          p_new_title: string
          p_new_content: string
        }
        Returns: Json
      }
    }
    Enums: {
      dwelling_type_enum:
        | "APARTMENT_BUILDING"
        | "SINGLE_FAMILY_HOME"
        | "TOWNHOUSE"
      follow_request_status_enum: "pending" | "approved" | "denied"
      profile_privacy_enum: "public" | "private"
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
      dwelling_type_enum: [
        "APARTMENT_BUILDING",
        "SINGLE_FAMILY_HOME",
        "TOWNHOUSE",
      ],
      follow_request_status_enum: ["pending", "approved", "denied"],
      profile_privacy_enum: ["public", "private"],
    },
  },
} as const
