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
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          last_activity_feed_view_at: string | null
          last_login_at: string | null
          phone_number: string | null
          phone_number_searchable: boolean
          profile_privacy_setting: Database["public"]["Enums"]["profile_privacy_enum"]
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id: string
          last_activity_feed_view_at?: string | null
          last_login_at?: string | null
          phone_number?: string | null
          phone_number_searchable?: boolean
          profile_privacy_setting?: Database["public"]["Enums"]["profile_privacy_enum"]
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          last_activity_feed_view_at?: string | null
          last_login_at?: string | null
          phone_number?: string | null
          phone_number_searchable?: boolean
          profile_privacy_setting?: Database["public"]["Enums"]["profile_privacy_enum"]
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
          id: string
          product_id: string | null
          rating: number
          service_location_id: string | null
          sitter_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          product_id?: string | null
          rating: number
          service_location_id?: string | null
          sitter_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          product_id?: string | null
          rating?: number
          service_location_id?: string | null
          sitter_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
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
          experience: string | null
          hourly_rate: number | null
          id: string
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
          experience?: string | null
          hourly_rate?: number | null
          id?: string
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
          experience?: string | null
          hourly_rate?: number | null
          id?: string
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
          building_identifier: string
          created_at: string
          dwelling_type: Database["public"]["Enums"]["dwelling_type_enum"]
          id: string
          is_primary: boolean | null
          latitude: number | null
          location_nickname: string
          longitude: number | null
          updated_at: string
          user_id: string
          zip_code: string
        }
        Insert: {
          address_details?: Json | null
          building_identifier: string
          created_at?: string
          dwelling_type?: Database["public"]["Enums"]["dwelling_type_enum"]
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          location_nickname: string
          longitude?: number | null
          updated_at?: string
          user_id: string
          zip_code?: string
        }
        Update: {
          address_details?: Json | null
          building_identifier?: string
          created_at?: string
          dwelling_type?: Database["public"]["Enums"]["dwelling_type_enum"]
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          location_nickname?: string
          longitude?: number | null
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
          experience: string | null
          hourly_rate: number | null
          id: string
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
      get_recent_activity_summary: {
        Args: { user_id: string }
        Returns: {
          activity_count: number
          most_recent_user_name: string
          most_recent_activity: string
        }[]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
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
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      update_activity_feed_view: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
