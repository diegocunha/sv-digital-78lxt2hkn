// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.17'
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          cnpj: string | null
          collected_at: string | null
          created_at: string
          exception_reason: string | null
          funnel_stage_id: string | null
          id: string
          name: string
          next_step: string | null
          next_step_due: string | null
          organization_id: string
          owner_id: string | null
          region: string | null
          sector: string | null
          site: string | null
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          collected_at?: string | null
          created_at?: string
          exception_reason?: string | null
          funnel_stage_id?: string | null
          id?: string
          name: string
          next_step?: string | null
          next_step_due?: string | null
          organization_id: string
          owner_id?: string | null
          region?: string | null
          sector?: string | null
          site?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          collected_at?: string | null
          created_at?: string
          exception_reason?: string | null
          funnel_stage_id?: string | null
          id?: string
          name?: string
          next_step?: string | null
          next_step_due?: string | null
          organization_id?: string
          owner_id?: string | null
          region?: string | null
          sector?: string | null
          site?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'accounts_funnel_stage_id_fkey'
            columns: ['funnel_stage_id']
            isOneToOne: false
            referencedRelation: 'funnel_stages'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'accounts_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      audit_events: {
        Row: {
          action: string
          actor: string | null
          after: Json | null
          before: Json | null
          created_at: string
          id: string
          object_id: string | null
          object_table: string
        }
        Insert: {
          action: string
          actor?: string | null
          after?: Json | null
          before?: Json | null
          created_at?: string
          id?: string
          object_id?: string | null
          object_table: string
        }
        Update: {
          action?: string
          actor?: string | null
          after?: Json | null
          before?: Json | null
          created_at?: string
          id?: string
          object_table?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          account_id: string | null
          confidence: string | null
          contact_preference: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          organization_id: string
          phone: string | null
          role: string | null
          source: string | null
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          account_id?: string | null
          confidence?: string | null
          contact_preference?: string | null
          created_at?: string
          id?: string
          name: string
          organization_id: string
          phone?: string | null
          role?: string | null
          source?: string | null
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          account_id?: string | null
          confidence?: string | null
          contact_preference?: string | null
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          phone?: string | null
          role?: string | null
          source?: string | null
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'contacts_account_id_fkey'
            columns: ['account_id']
            isOneToOne: false
            referencedRelation: 'accounts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'contacts_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      funnel_stages: {
        Row: {
          created_at: string
          id: string
          is_terminal: boolean
          name: string
          organization_id: string
          position: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_terminal?: boolean
          name: string
          organization_id: string
          position?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_terminal?: boolean
          name?: string
          organization_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: 'funnel_stages_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      icp_versions: {
        Row: {
          approved_by: string | null
          created_at: string
          criteria: Json
          id: string
          impediments: Json
          name: string
          organization_id: string
          published: boolean
          valid_from: string | null
          valid_until: string | null
          version: number
          weights: Json
        }
        Insert: {
          approved_by?: string | null
          created_at?: string
          criteria?: Json
          impediments?: Json
          id?: string
          name: string
          organization_id: string
          published?: boolean
          valid_from?: string | null
          valid_until?: string | null
          version: number
          weights?: Json
        }
        Update: {
          approved_by?: string | null
          created_at?: string
          criteria?: Json
          impediments?: Json
          id?: string
          name?: string
          organization_id?: string
          published?: boolean
          valid_from?: string | null
          valid_until?: string | null
          version?: number
          weights?: Json
        }
        Relationships: [
          {
            foreignKeyName: 'icp_versions_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      import_batches: {
        Row: {
          created_at: string
          file_hash: string
          id: string
          imported_by: string | null
          organization_id: string
          status: string
        }
        Insert: {
          created_at?: string
          file_hash: string
          id?: string
          imported_by?: string | null
          organization_id: string
          status?: string
        }
        Update: {
          created_at?: string
          file_hash?: string
          id?: string
          imported_by?: string | null
          organization_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'import_batches_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      import_batch_rows: {
        Row: {
          account_id: string | null
          batch_id: string
          category: string
          contact_id: string | null
          created_at: string
          id: string
          legacy_stage: string | null
          line_number: number
          organization_id: string
          raw: Json | null
          reason: string | null
          responsible_name: string | null
        }
        Insert: {
          account_id?: string | null
          batch_id: string
          category: string
          contact_id?: string | null
          created_at?: string
          id?: string
          legacy_stage?: string | null
          line_number: number
          organization_id: string
          raw?: Json | null
          reason?: string | null
          responsible_name?: string | null
        }
        Update: {
          account_id?: string | null
          batch_id?: string
          category?: string
          contact_id?: string | null
          created_at?: string
          id?: string
          legacy_stage?: string | null
          line_number?: number
          organization_id?: string
          raw?: Json | null
          reason?: string | null
          responsible_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'import_batch_rows_account_id_fkey'
            columns: ['account_id']
            isOneToOne: false
            referencedRelation: 'accounts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'import_batch_rows_batch_id_fkey'
            columns: ['batch_id']
            isOneToOne: false
            referencedRelation: 'import_batches'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'import_batch_rows_contact_id_fkey'
            columns: ['contact_id']
            isOneToOne: false
            referencedRelation: 'contacts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'import_batch_rows_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      memberships: {
        Row: {
          active: boolean
          created_at: string
          id: string
          organization_id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          organization_id: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          organization_id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'memberships_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'memberships_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name: string
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string | null
          id: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_global_role: { Args: { roles: string[] }; Returns: boolean }
      import_batch_report: { Args: { p_batch_id: string }; Returns: Json }
      import_commercial_base: {
        Args: { p_csv: string; p_file_hash: string; p_organization_id: string }
        Returns: Json
      }
      is_active_member: { Args: never; Returns: boolean }
      jwt_sub: { Args: never; Returns: string }
      my_role: { Args: { p_org: string }; Returns: string }
      revoke_member: {
        Args: { p_org: string; p_user: string }
        Returns: undefined
      }
      role_in_org: { Args: { org: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Insert: infer I
      }
      ? I
      : never
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Update: infer U
      }
      ? U
      : never
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
    : never
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchema['public']['CompositeTypes'] extends never
      ? never
      : DefaultSchema['CompositeTypes']][CompositeTypeName]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
