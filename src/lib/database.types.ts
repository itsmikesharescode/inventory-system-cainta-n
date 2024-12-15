export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      borrowed_items_tb: {
        Row: {
          created_at: string;
          date: string;
          id: number;
          item_id: number;
          quantity: number;
          reference_id: string;
          room_id: number;
          time: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          date: string;
          id?: number;
          item_id: number;
          quantity: number;
          reference_id: string;
          room_id: number;
          time: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          date?: string;
          id?: number;
          item_id?: number;
          quantity?: number;
          reference_id?: string;
          room_id?: number;
          time?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'borrowed_items_tb_items_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'items_tb';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'borrowed_items_tb_room_id_fkey';
            columns: ['room_id'];
            isOneToOne: false;
            referencedRelation: 'rooms_tb';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'borrowed_items_tb_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'teachers_tb';
            referencedColumns: ['user_id'];
          }
        ];
      };
      departments_tb: {
        Row: {
          code: string;
          created_at: string;
          id: number;
          name: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          id?: number;
          name: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      items_tb: {
        Row: {
          brand: string;
          category: string;
          created_at: string;
          description: string;
          device_id: string;
          id: number;
          model: string;
          mr: string;
          quantity: number;
          status: string;
          type: string;
        };
        Insert: {
          brand: string;
          category: string;
          created_at?: string;
          description: string;
          device_id: string;
          id?: number;
          model: string;
          mr: string;
          quantity: number;
          status: string;
          type: string;
        };
        Update: {
          brand?: string;
          category?: string;
          created_at?: string;
          description?: string;
          device_id?: string;
          id?: number;
          model?: string;
          mr?: string;
          quantity?: number;
          status?: string;
          type?: string;
        };
        Relationships: [];
      };
      reservations_tb: {
        Row: {
          created_at: string;
          date: string;
          id: number;
          item_id: number;
          quantity: number;
          reference_id: string;
          room_id: number;
          status: string;
          time: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          date: string;
          id?: number;
          item_id: number;
          quantity: number;
          reference_id: string;
          room_id: number;
          status?: string;
          time: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          date?: string;
          id?: number;
          item_id?: number;
          quantity?: number;
          reference_id?: string;
          room_id?: number;
          status?: string;
          time?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reservations_tb_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'items_tb';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reservations_tb_room_id_fkey';
            columns: ['room_id'];
            isOneToOne: false;
            referencedRelation: 'rooms_tb';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reservations_tb_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'teachers_tb';
            referencedColumns: ['user_id'];
          }
        ];
      };
      returned_items_tb: {
        Row: {
          borrowed_date: string;
          created_at: string;
          id: number;
          item_name: string;
          quantity: number;
          reference_id: string;
          remarks: string;
          room_name: string;
          user_id: string;
        };
        Insert: {
          borrowed_date: string;
          created_at?: string;
          id?: number;
          item_name: string;
          quantity: number;
          reference_id: string;
          remarks: string;
          room_name: string;
          user_id: string;
        };
        Update: {
          borrowed_date?: string;
          created_at?: string;
          id?: number;
          item_name?: string;
          quantity?: number;
          reference_id?: string;
          remarks?: string;
          room_name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'returned_items_tb_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'teachers_tb';
            referencedColumns: ['user_id'];
          }
        ];
      };
      roles_tb: {
        Row: {
          created_at: string;
          role: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          role: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      rooms_tb: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          number: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
          number: number;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          number?: number;
        };
        Relationships: [];
      };
      teachers_tb: {
        Row: {
          created_at: string;
          user_id: string;
          user_meta_data: Json;
        };
        Insert: {
          created_at?: string;
          user_id: string;
          user_meta_data: Json;
        };
        Update: {
          created_at?: string;
          user_id?: string;
          user_meta_data?: Json;
        };
        Relationships: [
          {
            foreignKeyName: 'teachers_tb_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users_tb';
            referencedColumns: ['user_id'];
          }
        ];
      };
      users_tb: {
        Row: {
          created_at: string;
          user_id: string;
          user_meta_data: Json;
        };
        Insert: {
          created_at?: string;
          user_id: string;
          user_meta_data: Json;
        };
        Update: {
          created_at?: string;
          user_id?: string;
          user_meta_data?: Json;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      admin_add_borrower: {
        Args: {
          user_id_param: string;
          item_id_param: number;
          date_param: string;
          time_param: string;
          reference_id_param: string;
          room_id_param: number;
          quantity_param: number;
        };
        Returns: undefined;
      };
      admin_add_returnee: {
        Args: {
          user_id_param: string;
          item_id_param: number;
          item_name_param: string;
          quantity_param: number;
          reference_id_param: string;
          room_name_param: string;
          remarks_param: string;
          borrowed_date_param: string;
        };
        Returns: undefined;
      };
      admin_dashboard_counters: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      admin_dashboard_counts: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      general_update_reservation_status: {
        Args: {
          reservation_id_client: number;
          item_id_param_client: number;
          status_client: string;
          user_id_client: string;
          date_client: string;
          time_client: string;
          reference_id_client: string;
          room_id_client: number;
          quantity_client: number;
        };
        Returns: undefined;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_teacher: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
