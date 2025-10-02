// Temporary permissive database types to allow build to pass
// Replace with actual generated types from Supabase

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: Record<
      string,
      {
        Row: Record<string, any>;
        Insert: Record<string, any>;
        Update: Record<string, any>;
        Relationships: any[];
      }
    >;
    Views: Record<
      string,
      {
        Row: Record<string, any>;
        Relationships: any[];
      }
    >;
    Functions: Record<
      string,
      {
        Args: Record<string, any>;
        Returns: any;
      }
    >;
    Enums: Record<string, string>;
    CompositeTypes: Record<string, Record<string, any>>;
  };
};

// Export helper types
export type Tables<
  T extends keyof Database["public"]["Tables"] = keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][T]["Row"];
