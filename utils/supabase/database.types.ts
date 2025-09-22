export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      banners: {
        Row: {
          alt_text: string | null;
          click_count: number | null;
          computed_ctr: number | null;
          created_at: string | null;
          end_at: string | null;
          id: string;
          image_url: string;
          impression_count: number | null;
          is_active: boolean | null;
          link_url: string | null;
          start_at: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          alt_text?: string | null;
          click_count?: number | null;
          computed_ctr?: number | null;
          created_at?: string | null;
          end_at?: string | null;
          id?: string;
          image_url: string;
          impression_count?: number | null;
          is_active?: boolean | null;
          link_url?: string | null;
          start_at?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          alt_text?: string | null;
          click_count?: number | null;
          computed_ctr?: number | null;
          created_at?: string | null;
          end_at?: string | null;
          id?: string;
          image_url?: string;
          impression_count?: number | null;
          is_active?: boolean | null;
          link_url?: string | null;
          start_at?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      buy_lead_responses: {
        Row: {
          buy_lead_id: string;
          created_at: string | null;
          currency: string | null;
          id: string;
          message: string | null;
          min_qty: number | null;
          quoted_price: number | null;
          status: string | null;
          supplier_id: string;
          updated_at: string | null;
        };
        Insert: {
          buy_lead_id: string;
          created_at?: string | null;
          currency?: string | null;
          id?: string;
          message?: string | null;
          min_qty?: number | null;
          quoted_price?: number | null;
          status?: string | null;
          supplier_id: string;
          updated_at?: string | null;
        };
        Update: {
          buy_lead_id?: string;
          created_at?: string | null;
          currency?: string | null;
          id?: string;
          message?: string | null;
          min_qty?: number | null;
          quoted_price?: number | null;
          status?: string | null;
          supplier_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "buy_lead_responses_buy_lead_id_fkey";
            columns: ["buy_lead_id"];
            isOneToOne: false;
            referencedRelation: "buy_leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "buy_lead_responses_buy_lead_id_fkey";
            columns: ["buy_lead_id"];
            isOneToOne: false;
            referencedRelation: "enriched_buy_leads";
            referencedColumns: ["id"];
          }
        ];
      };
      buy_leads: {
        Row: {
          buyer_id: string;
          contact_email: string | null;
          contact_phone: string | null;
          created_at: string | null;
          currency: string | null;
          customization: Json | null;
          delivery_city: string | null;
          delivery_pincode: string | null;
          id: string;
          notes: string | null;
          product_id: string | null;
          product_name: string | null;
          quantity_required: number | null;
          status: Database["public"]["Enums"]["rfq_status"] | null;
          supplier_id: string;
          supplier_name: string | null;
          target_price: number | null;
          tier_pricing_snapshot: Json | null;
          updated_at: string | null;
        };
        Insert: {
          buyer_id: string;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string | null;
          currency?: string | null;
          customization?: Json | null;
          delivery_city?: string | null;
          delivery_pincode?: string | null;
          id?: string;
          notes?: string | null;
          product_id?: string | null;
          product_name?: string | null;
          quantity_required?: number | null;
          status?: Database["public"]["Enums"]["rfq_status"] | null;
          supplier_id: string;
          supplier_name?: string | null;
          target_price?: number | null;
          tier_pricing_snapshot?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          buyer_id?: string;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string | null;
          currency?: string | null;
          customization?: Json | null;
          delivery_city?: string | null;
          delivery_pincode?: string | null;
          id?: string;
          notes?: string | null;
          product_id?: string | null;
          product_name?: string | null;
          quantity_required?: number | null;
          status?: Database["public"]["Enums"]["rfq_status"] | null;
          supplier_id?: string;
          supplier_name?: string | null;
          target_price?: number | null;
          tier_pricing_snapshot?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "buy_leads_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      categories: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          parent_id: string | null;
          slug: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          parent_id?: string | null;
          slug: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          parent_id?: string | null;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      messages: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          receiver: string | null;
          sender: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          receiver?: string | null;
          sender?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          receiver?: string | null;
          sender?: string | null;
        };
        Relationships: [];
      };
      notification_preferences: {
        Row: {
          email: boolean;
          in_app: boolean;
          muted_types: Database["public"]["Enums"]["notification_type"][];
          push: boolean;
          supplier_profile_id: string;
          updated_at: string;
        };
        Insert: {
          email?: boolean;
          in_app?: boolean;
          muted_types?: Database["public"]["Enums"]["notification_type"][];
          push?: boolean;
          supplier_profile_id: string;
          updated_at?: string;
        };
        Update: {
          email?: boolean;
          in_app?: boolean;
          muted_types?: Database["public"]["Enums"]["notification_type"][];
          push?: boolean;
          supplier_profile_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notification_receipts: {
        Row: {
          archived_at: string | null;
          created_at: string;
          delivered_at: string;
          id: string;
          meta: Json | null;
          notification_id: string;
          read_at: string | null;
          status: Database["public"]["Enums"]["receipt_status"];
          supplier_profile_id: string;
        };
        Insert: {
          archived_at?: string | null;
          created_at?: string;
          delivered_at?: string;
          id?: string;
          meta?: Json | null;
          notification_id: string;
          read_at?: string | null;
          status?: Database["public"]["Enums"]["receipt_status"];
          supplier_profile_id: string;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string;
          delivered_at?: string;
          id?: string;
          meta?: Json | null;
          notification_id?: string;
          read_at?: string | null;
          status?: Database["public"]["Enums"]["receipt_status"];
          supplier_profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notification_receipts_notification_id_fkey";
            columns: ["notification_id"];
            isOneToOne: false;
            referencedRelation: "notifications";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          action_url: string | null;
          body: string;
          created_at: string;
          created_by: string;
          id: string;
          meta: Json | null;
          schedule_at: string | null;
          segments: Json | null;
          severity: Database["public"]["Enums"]["notification_severity"];
          title: string;
          type: Database["public"]["Enums"]["notification_type"];
        };
        Insert: {
          action_url?: string | null;
          body: string;
          created_at?: string;
          created_by: string;
          id?: string;
          meta?: Json | null;
          schedule_at?: string | null;
          segments?: Json | null;
          severity?: Database["public"]["Enums"]["notification_severity"];
          title: string;
          type?: Database["public"]["Enums"]["notification_type"];
        };
        Update: {
          action_url?: string | null;
          body?: string;
          created_at?: string;
          created_by?: string;
          id?: string;
          meta?: Json | null;
          schedule_at?: string | null;
          segments?: Json | null;
          severity?: Database["public"]["Enums"]["notification_severity"];
          title?: string;
          type?: Database["public"]["Enums"]["notification_type"];
        };
        Relationships: [];
      };
      payment_gateway_config: {
        Row: {
          config_data: Json;
          created_at: string | null;
          gateway_name: string;
          id: string;
          is_active: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          config_data: Json;
          created_at?: string | null;
          gateway_name: string;
          id?: string;
          is_active?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          config_data?: Json;
          created_at?: string | null;
          gateway_name?: string;
          id?: string;
          is_active?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          amount: number;
          cashfree_order_id: string | null;
          cashfree_payment_id: string | null;
          cashfree_payment_session_id: string | null;
          completed_at: string | null;
          created_at: string | null;
          currency: string | null;
          failure_reason: string | null;
          gateway_response: Json | null;
          id: string;
          order_id: string;
          order_type: string;
          payment_method: string;
          payment_status: string | null;
          updated_at: string | null;
        };
        Insert: {
          amount: number;
          cashfree_order_id?: string | null;
          cashfree_payment_id?: string | null;
          cashfree_payment_session_id?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          currency?: string | null;
          failure_reason?: string | null;
          gateway_response?: Json | null;
          id?: string;
          order_id: string;
          order_type?: string;
          payment_method: string;
          payment_status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          amount?: number;
          cashfree_order_id?: string | null;
          cashfree_payment_id?: string | null;
          cashfree_payment_session_id?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          currency?: string | null;
          failure_reason?: string | null;
          gateway_response?: Json | null;
          id?: string;
          order_id?: string;
          order_type?: string;
          payment_method?: string;
          payment_status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "sample_orders";
            referencedColumns: ["id"];
          }
        ];
      };
      product_colors: {
        Row: {
          color_id: string;
          created_at: string;
          product_id: string;
        };
        Insert: {
          color_id: string;
          created_at?: string;
          product_id: string;
        };
        Update: {
          color_id?: string;
          created_at?: string;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_colors_color_id_fkey";
            columns: ["color_id"];
            isOneToOne: false;
            referencedRelation: "supplier_colors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_colors_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      product_images: {
        Row: {
          created_at: string | null;
          display_order: number | null;
          id: string;
          image_url: string;
          product_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          image_url: string;
          product_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          image_url?: string;
          product_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      product_sizes: {
        Row: {
          created_at: string;
          product_id: string;
          size_id: string;
        };
        Insert: {
          created_at?: string;
          product_id: string;
          size_id: string;
        };
        Update: {
          created_at?: string;
          product_id?: string;
          size_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_sizes_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_sizes_size_id_fkey";
            columns: ["size_id"];
            isOneToOne: false;
            referencedRelation: "supplier_sizes";
            referencedColumns: ["id"];
          }
        ];
      };
      product_specifications: {
        Row: {
          created_at: string | null;
          id: string;
          product_id: string;
          spec_name: string;
          spec_unit: string | null;
          spec_value: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          product_id: string;
          spec_name: string;
          spec_unit?: string | null;
          spec_value: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          product_id?: string;
          spec_name?: string;
          spec_unit?: string | null;
          spec_value?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_specifications_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      product_tags: {
        Row: {
          product_id: string;
          tag_id: string;
        };
        Insert: {
          product_id: string;
          tag_id: string;
        };
        Update: {
          product_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_tags_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      product_tier_pricing: {
        Row: {
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          price: number;
          product_id: string;
          quantity: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          price: number;
          product_id: string;
          quantity: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          price?: number;
          product_id?: string;
          quantity?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_tier_pricing_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      products: {
        Row: {
          brand: string | null;
          breadth: number | null;
          category_id: string | null;
          country_of_origin: string | null;
          created_at: string | null;
          description: string;
          dispatch_time: number | null;
          dropship_available: boolean | null;
          dropship_price: number | null;
          height: number | null;
          hsn_code: string | null;
          id: string;
          is_active: boolean | null;
          is_bulk_pricing: boolean | null;
          is_sample_available: boolean | null;
          length: number | null;
          name: string;
          price_per_unit: number | null;
          quantity: number | null;
          subcategory_id: string | null;
          supplier_id: string | null;
          total_price: number | null;
          updated_at: string | null;
          weight: number | null;
          white_label_shipping: boolean | null;
          youtube_link: string | null;
        };
        Insert: {
          brand?: string | null;
          breadth?: number | null;
          category_id?: string | null;
          country_of_origin?: string | null;
          created_at?: string | null;
          description: string;
          dispatch_time?: number | null;
          dropship_available?: boolean | null;
          dropship_price?: number | null;
          height?: number | null;
          hsn_code?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_bulk_pricing?: boolean | null;
          is_sample_available?: boolean | null;
          length?: number | null;
          name: string;
          price_per_unit?: number | null;
          quantity?: number | null;
          subcategory_id?: string | null;
          supplier_id?: string | null;
          total_price?: number | null;
          updated_at?: string | null;
          weight?: number | null;
          white_label_shipping?: boolean | null;
          youtube_link?: string | null;
        };
        Update: {
          brand?: string | null;
          breadth?: number | null;
          category_id?: string | null;
          country_of_origin?: string | null;
          created_at?: string | null;
          description?: string;
          dispatch_time?: number | null;
          dropship_available?: boolean | null;
          dropship_price?: number | null;
          height?: number | null;
          hsn_code?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_bulk_pricing?: boolean | null;
          is_sample_available?: boolean | null;
          length?: number | null;
          name?: string;
          price_per_unit?: number | null;
          quantity?: number | null;
          subcategory_id?: string | null;
          supplier_id?: string | null;
          total_price?: number | null;
          updated_at?: string | null;
          weight?: number | null;
          white_label_shipping?: boolean | null;
          youtube_link?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_subcategory_id_fkey";
            columns: ["subcategory_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_supplier_id_fkey";
            columns: ["supplier_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          business_type: string | null;
          created_at: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          is_phone_verified: boolean | null;
          phone_number: number | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          business_type?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          is_phone_verified?: boolean | null;
          phone_number?: number | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          business_type?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          is_phone_verified?: boolean | null;
          phone_number?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      sample_order_items: {
        Row: {
          created_at: string | null;
          id: string;
          price_per_unit: number;
          product_id: string | null;
          quantity: number | null;
          sample_order_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          price_per_unit: number;
          product_id?: string | null;
          quantity?: number | null;
          sample_order_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          price_per_unit?: number;
          product_id?: string | null;
          quantity?: number | null;
          sample_order_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sample_order_items_sample_order_id_fkey";
            columns: ["sample_order_id"];
            isOneToOne: false;
            referencedRelation: "sample_orders";
            referencedColumns: ["id"];
          }
        ];
      };
      sample_orders: {
        Row: {
          actual_delivery_date: string | null;
          buyer_id: string | null;
          cashfree_order_id: string | null;
          cashfree_payment_id: string | null;
          cashfree_payment_session_id: string | null;
          created_at: string | null;
          estimated_delivery_date: string | null;
          id: string;
          notes: string | null;
          order_number: string;
          payment_completed_at: string | null;
          payment_gateway_response: Json | null;
          payment_method: string | null;
          payment_status: string | null;
          rapidshyp_awb_number: string | null;
          rapidshyp_order_id: string | null;
          rapidshyp_tracking_id: string | null;
          refund_amount: number | null;
          refund_status: string | null;
          shipping_address: Json;
          shipping_cost: number | null;
          shipping_method: string | null;
          shipping_status: string | null;
          status: Database["public"]["Enums"]["order_status"] | null;
          supplier_id: string | null;
          total_amount: number;
          updated_at: string | null;
        };
        Insert: {
          actual_delivery_date?: string | null;
          buyer_id?: string | null;
          cashfree_order_id?: string | null;
          cashfree_payment_id?: string | null;
          cashfree_payment_session_id?: string | null;
          created_at?: string | null;
          estimated_delivery_date?: string | null;
          id?: string;
          notes?: string | null;
          order_number: string;
          payment_completed_at?: string | null;
          payment_gateway_response?: Json | null;
          payment_method?: string | null;
          payment_status?: string | null;
          rapidshyp_awb_number?: string | null;
          rapidshyp_order_id?: string | null;
          rapidshyp_tracking_id?: string | null;
          refund_amount?: number | null;
          refund_status?: string | null;
          shipping_address: Json;
          shipping_cost?: number | null;
          shipping_method?: string | null;
          shipping_status?: string | null;
          status?: Database["public"]["Enums"]["order_status"] | null;
          supplier_id?: string | null;
          total_amount: number;
          updated_at?: string | null;
        };
        Update: {
          actual_delivery_date?: string | null;
          buyer_id?: string | null;
          cashfree_order_id?: string | null;
          cashfree_payment_id?: string | null;
          cashfree_payment_session_id?: string | null;
          created_at?: string | null;
          estimated_delivery_date?: string | null;
          id?: string;
          notes?: string | null;
          order_number?: string;
          payment_completed_at?: string | null;
          payment_gateway_response?: Json | null;
          payment_method?: string | null;
          payment_status?: string | null;
          rapidshyp_awb_number?: string | null;
          rapidshyp_order_id?: string | null;
          rapidshyp_tracking_id?: string | null;
          refund_amount?: number | null;
          refund_status?: string | null;
          shipping_address?: Json;
          shipping_cost?: number | null;
          shipping_method?: string | null;
          shipping_status?: string | null;
          status?: Database["public"]["Enums"]["order_status"] | null;
          supplier_id?: string | null;
          total_amount?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sample_orders_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sample_orders_supplier_id_fkey";
            columns: ["supplier_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      shipments: {
        Row: {
          actual_delivery_date: string | null;
          created_at: string | null;
          delivery_address: Json;
          estimated_delivery_date: string | null;
          id: string;
          order_id: string;
          order_type: string;
          package_dimensions: Json | null;
          package_weight: number | null;
          pickup_address: Json;
          rapidshyp_awb_number: string | null;
          rapidshyp_order_id: string | null;
          rapidshyp_tracking_id: string | null;
          shipping_cost: number;
          shipping_method: string;
          shipping_status: string | null;
          tracking_updates: Json | null;
          updated_at: string | null;
        };
        Insert: {
          actual_delivery_date?: string | null;
          created_at?: string | null;
          delivery_address: Json;
          estimated_delivery_date?: string | null;
          id?: string;
          order_id: string;
          order_type?: string;
          package_dimensions?: Json | null;
          package_weight?: number | null;
          pickup_address: Json;
          rapidshyp_awb_number?: string | null;
          rapidshyp_order_id?: string | null;
          rapidshyp_tracking_id?: string | null;
          shipping_cost?: number;
          shipping_method: string;
          shipping_status?: string | null;
          tracking_updates?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          actual_delivery_date?: string | null;
          created_at?: string | null;
          delivery_address?: Json;
          estimated_delivery_date?: string | null;
          id?: string;
          order_id?: string;
          order_type?: string;
          package_dimensions?: Json | null;
          package_weight?: number | null;
          pickup_address?: Json;
          rapidshyp_awb_number?: string | null;
          rapidshyp_order_id?: string | null;
          rapidshyp_tracking_id?: string | null;
          shipping_cost?: number;
          shipping_method?: string;
          shipping_status?: string | null;
          tracking_updates?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "sample_orders";
            referencedColumns: ["id"];
          }
        ];
      };
      shipping_zones: {
        Row: {
          base_cost: number | null;
          cost_per_kg: number | null;
          created_at: string | null;
          estimated_delivery_days: number | null;
          id: string;
          is_active: boolean | null;
          pincodes: string[] | null;
          shipping_method: string;
          zone_name: string;
        };
        Insert: {
          base_cost?: number | null;
          cost_per_kg?: number | null;
          created_at?: string | null;
          estimated_delivery_days?: number | null;
          id?: string;
          is_active?: boolean | null;
          pincodes?: string[] | null;
          shipping_method: string;
          zone_name: string;
        };
        Update: {
          base_cost?: number | null;
          cost_per_kg?: number | null;
          created_at?: string | null;
          estimated_delivery_days?: number | null;
          id?: string;
          is_active?: boolean | null;
          pincodes?: string[] | null;
          shipping_method?: string;
          zone_name?: string;
        };
        Relationships: [];
      };
      supplier_businesses: {
        Row: {
          alternate_phone: string | null;
          business_address: string;
          business_name: string;
          city: string;
          created_at: string | null;
          gst_certificate_url: string | null;
          gst_number: string;
          id: string;
          is_verified: boolean | null;
          message: string | null;
          phone: number;
          pincode: string;
          profile_avatar_url: string | null;
          profile_id: string | null;
          state: string;
          status: Database["public"]["Enums"]["verification_status"] | null;
          type: Database["public"]["Enums"]["business-type"] | null;
          updated_at: string | null;
        };
        Insert: {
          alternate_phone?: string | null;
          business_address: string;
          business_name: string;
          city: string;
          created_at?: string | null;
          gst_certificate_url?: string | null;
          gst_number: string;
          id?: string;
          is_verified?: boolean | null;
          message?: string | null;
          phone: number;
          pincode: string;
          profile_avatar_url?: string | null;
          profile_id?: string | null;
          state: string;
          status?: Database["public"]["Enums"]["verification_status"] | null;
          type?: Database["public"]["Enums"]["business-type"] | null;
          updated_at?: string | null;
        };
        Update: {
          alternate_phone?: string | null;
          business_address?: string;
          business_name?: string;
          city?: string;
          created_at?: string | null;
          gst_certificate_url?: string | null;
          gst_number?: string;
          id?: string;
          is_verified?: boolean | null;
          message?: string | null;
          phone?: number;
          pincode?: string;
          profile_avatar_url?: string | null;
          profile_id?: string | null;
          state?: string;
          status?: Database["public"]["Enums"]["verification_status"] | null;
          type?: Database["public"]["Enums"]["business-type"] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "supplier_businesses_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      supplier_colors: {
        Row: {
          created_at: string;
          hex_code: string;
          id: string;
          name: string;
          supplier_id: string;
        };
        Insert: {
          created_at?: string;
          hex_code: string;
          id?: string;
          name: string;
          supplier_id: string;
        };
        Update: {
          created_at?: string;
          hex_code?: string;
          id?: string;
          name?: string;
          supplier_id?: string;
        };
        Relationships: [];
      };
      supplier_shipping_preferences: {
        Row: {
          base_cost: number | null;
          created_at: string | null;
          id: string;
          is_enabled: boolean | null;
          region_based_pricing: Json | null;
          shipping_method: string;
          supplier_id: string;
          updated_at: string | null;
          weight_based_pricing: Json | null;
        };
        Insert: {
          base_cost?: number | null;
          created_at?: string | null;
          id?: string;
          is_enabled?: boolean | null;
          region_based_pricing?: Json | null;
          shipping_method: string;
          supplier_id: string;
          updated_at?: string | null;
          weight_based_pricing?: Json | null;
        };
        Update: {
          base_cost?: number | null;
          created_at?: string | null;
          id?: string;
          is_enabled?: boolean | null;
          region_based_pricing?: Json | null;
          shipping_method?: string;
          supplier_id?: string;
          updated_at?: string | null;
          weight_based_pricing?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "supplier_shipping_preferences_supplier_id_fkey";
            columns: ["supplier_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      supplier_sizes: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          supplier_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          supplier_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          supplier_id?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      user_addresses: {
        Row: {
          address_line_1: string;
          address_line_2: string | null;
          address_type: string;
          area: string | null;
          city: string;
          country: string;
          created_at: string;
          deleted_at: string | null;
          delivery_instructions: string | null;
          district: string | null;
          email: string | null;
          full_name: string;
          id: string;
          is_active: boolean | null;
          is_default_billing: boolean | null;
          is_default_shipping: boolean | null;
          is_primary: boolean | null;
          is_verified: boolean | null;
          landmark: string | null;
          landmark_description: string | null;
          locality: string | null;
          phone_number: string | null;
          pincode: string | null;
          postal_code: string;
          profile_id: string;
          state: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          address_line_1: string;
          address_line_2?: string | null;
          address_type?: string;
          area?: string | null;
          city: string;
          country?: string;
          created_at?: string;
          deleted_at?: string | null;
          delivery_instructions?: string | null;
          district?: string | null;
          email?: string | null;
          full_name: string;
          id?: string;
          is_active?: boolean | null;
          is_default_billing?: boolean | null;
          is_default_shipping?: boolean | null;
          is_primary?: boolean | null;
          is_verified?: boolean | null;
          landmark?: string | null;
          landmark_description?: string | null;
          locality?: string | null;
          phone_number?: string | null;
          pincode?: string | null;
          postal_code: string;
          profile_id: string;
          state: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          address_line_1?: string;
          address_line_2?: string | null;
          address_type?: string;
          area?: string | null;
          city?: string;
          country?: string;
          created_at?: string;
          deleted_at?: string | null;
          delivery_instructions?: string | null;
          district?: string | null;
          email?: string | null;
          full_name?: string;
          id?: string;
          is_active?: boolean | null;
          is_default_billing?: boolean | null;
          is_default_shipping?: boolean | null;
          is_primary?: boolean | null;
          is_verified?: boolean | null;
          landmark?: string | null;
          landmark_description?: string | null;
          locality?: string | null;
          phone_number?: string | null;
          pincode?: string | null;
          postal_code?: string;
          profile_id?: string;
          state?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_addresses_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      enriched_buy_lead_responses: {
        Row: {
          buy_lead_id: string | null;
          buyer_id: string | null;
          created_at: string | null;
          currency: string | null;
          id: string | null;
          message: string | null;
          min_qty: number | null;
          product_id: string | null;
          product_name: string | null;
          quantity_required: number | null;
          quoted_price: number | null;
          rfq_currency: string | null;
          status: string | null;
          supplier_avatar: string | null;
          supplier_business_name: string | null;
          supplier_business_type: string | null;
          supplier_city: string | null;
          supplier_email: string | null;
          supplier_gst: string | null;
          supplier_id: string | null;
          supplier_name: string | null;
          supplier_name_full: string | null;
          supplier_phone: number | null;
          supplier_state: string | null;
          supplier_verified: boolean | null;
          target_price: number | null;
          updated_at: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "buy_lead_responses_buy_lead_id_fkey";
            columns: ["buy_lead_id"];
            isOneToOne: false;
            referencedRelation: "buy_leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "buy_lead_responses_buy_lead_id_fkey";
            columns: ["buy_lead_id"];
            isOneToOne: false;
            referencedRelation: "enriched_buy_leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "buy_leads_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      enriched_buy_leads: {
        Row: {
          buyer_avatar: string | null;
          buyer_business_type: string | null;
          buyer_email: string | null;
          buyer_id: string | null;
          buyer_name: string | null;
          buyer_phone: number | null;
          contact_email: string | null;
          contact_phone: string | null;
          created_at: string | null;
          currency: string | null;
          customization: Json | null;
          delivery_city: string | null;
          delivery_pincode: string | null;
          id: string | null;
          notes: string | null;
          product_available_qty: number | null;
          product_brand: string | null;
          product_description: string | null;
          product_id: string | null;
          product_is_active: boolean | null;
          product_name: string | null;
          product_name_full: string | null;
          product_price: number | null;
          quantity_required: number | null;
          status: Database["public"]["Enums"]["rfq_status"] | null;
          supplier_avatar: string | null;
          supplier_business_name: string | null;
          supplier_business_type: string | null;
          supplier_city: string | null;
          supplier_email: string | null;
          supplier_gst: string | null;
          supplier_id: string | null;
          supplier_name: string | null;
          supplier_name_full: string | null;
          supplier_phone: number | null;
          supplier_state: string | null;
          supplier_verified: boolean | null;
          target_price: number | null;
          tier_pricing_snapshot: Json | null;
          updated_at: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "buy_leads_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Functions: {
      get_distinct_receivers: {
        Args: { sender_id: string };
        Returns: {
          receiver: string;
        }[];
      };
      get_product_specifications: {
        Args: { p_product_id: string };
        Returns: {
          display_order: number;
          spec_name: string;
          spec_unit: string;
          spec_value: string;
        }[];
      };
      increment_banner_clicks: {
        Args: { banner_id: string };
        Returns: undefined;
      };
      increment_banner_impressions: {
        Args: { banner_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      "business-type":
        | "MANUFACTURER"
        | "WHOLESALER"
        | "DISTRIBUTOR"
        | "TRADER / RESELLER"
        | "DROPSHIPPER"
        | "EXPORTER"
        | "IMPORTER"
        | "OTHER";
      notification_severity: "info" | "warning" | "critical";
      notification_type: "system" | "policy" | "order" | "rfq" | "marketing";
      order_status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled";
      payment_status_type:
        | "pending"
        | "initiated"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
        | "refunded"
        | "partially_refunded";
      receipt_status: "unread" | "read" | "archived";
      rfq_status: "submitted" | "viewed" | "responded" | "closed" | "cancelled";
      shipping_status_type:
        | "pending"
        | "confirmed"
        | "picked_up"
        | "in_transit"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
        | "returned";
      verification_status: "PENDING" | "REJECTED" | "APPROVED";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      "business-type": [
        "MANUFACTURER",
        "WHOLESALER",
        "DISTRIBUTOR",
        "TRADER / RESELLER",
        "DROPSHIPPER",
        "EXPORTER",
        "IMPORTER",
        "OTHER",
      ],
      notification_severity: ["info", "warning", "critical"],
      notification_type: ["system", "policy", "order", "rfq", "marketing"],
      order_status: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_status_type: [
        "pending",
        "initiated",
        "processing",
        "completed",
        "failed",
        "cancelled",
        "refunded",
        "partially_refunded",
      ],
      receipt_status: ["unread", "read", "archived"],
      rfq_status: ["submitted", "viewed", "responded", "closed", "cancelled"],
      shipping_status_type: [
        "pending",
        "confirmed",
        "picked_up",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
      ],
      verification_status: ["PENDING", "REJECTED", "APPROVED"],
    },
  },
} as const;
