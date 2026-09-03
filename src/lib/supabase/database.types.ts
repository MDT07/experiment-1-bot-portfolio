export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type StudioProjectRow = {
  id: string;
  owner_user_id: string;
  brief: Json;
  blueprint: Json;
  provider: string;
  model: string;
  status: string;
  preview_messages_used: number;
  preview_message_limit: number;
  generation_usage: Json | null;
  created_at: string;
  updated_at: string;
};

type StudioGenerationEntitlementRow = {
  user_id: string;
  state: string;
  reservation_id: string | null;
  reserved_at: string | null;
  used_at: string | null;
  project_id: string | null;
  created_at: string;
  updated_at: string;
};

type StudioMessageRow = {
  id: number;
  project_id: string;
  owner_user_id: string;
  role: string;
  content: string;
  created_at: string;
};

type StudioGenerationRunRow = {
  id: string;
  owner_user_id: string;
  project_id: string | null;
  operation: string;
  provider: string;
  model: string;
  status: string;
  error_code: string | null;
  duration_ms: number | null;
  input_tokens: number | null;
  output_tokens: number | null;
  total_tokens: number | null;
  cached_input_tokens: number | null;
  estimated_cost_usd: number | null;
  billing_mode: string | null;
  created_at: string;
  completed_at: string | null;
};

export type Database = {
  public: {
    Tables: {
      studio_projects: {
        Row: StudioProjectRow;
        Insert: Pick<StudioProjectRow, "owner_user_id" | "brief" | "blueprint" | "provider" | "model"> &
          Partial<Pick<StudioProjectRow, "id" | "status" | "preview_messages_used" | "preview_message_limit" | "generation_usage" | "created_at" | "updated_at">>;
        Update: Partial<StudioProjectRow>;
        Relationships: [];
      };
      studio_generation_entitlements: {
        Row: StudioGenerationEntitlementRow;
        Insert: Pick<StudioGenerationEntitlementRow, "user_id"> & Partial<Omit<StudioGenerationEntitlementRow, "user_id">>;
        Update: Partial<StudioGenerationEntitlementRow>;
        Relationships: [];
      };
      studio_messages: {
        Row: StudioMessageRow;
        Insert: Pick<StudioMessageRow, "project_id" | "owner_user_id" | "role" | "content"> &
          Partial<Pick<StudioMessageRow, "id" | "created_at">>;
        Update: Partial<StudioMessageRow>;
        Relationships: [];
      };
      studio_generation_runs: {
        Row: StudioGenerationRunRow;
        Insert: Pick<StudioGenerationRunRow, "owner_user_id" | "operation" | "provider" | "model" | "status"> &
          Partial<Pick<StudioGenerationRunRow, "id" | "project_id" | "error_code" | "duration_ms" | "input_tokens" | "output_tokens" | "total_tokens" | "cached_input_tokens" | "estimated_cost_usd" | "billing_mode" | "created_at" | "completed_at">>;
        Update: Partial<StudioGenerationRunRow>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      reserve_studio_generation: {
        Args: Record<PropertyKey, never>;
        Returns: {
          allowed: boolean;
          reservation_id: string | null;
          reason: string;
          project_id: string | null;
        }[];
      };
      complete_studio_generation: {
        Args: { target_reservation: string; target_project: string };
        Returns: boolean;
      };
      release_studio_generation: {
        Args: { target_user: string; target_reservation: string };
        Returns: boolean;
      };
      claim_studio_preview_message: {
        Args: { target_project: string };
        Returns: boolean;
      };
      release_studio_preview_message: {
        Args: { target_user: string; target_project: string };
        Returns: boolean;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
