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
      devices: {
        Row: {
          created_at: string
          device_name: string
          id: number
          status: boolean | null
        }
        Insert: {
          created_at?: string
          device_name: string
          id?: number
          status?: boolean | null
        }
        Update: {
          created_at?: string
          device_name?: string
          id?: number
          status?: boolean | null
        }
        Relationships: []
      }
      falldetection: {
        Row: {
          created_at: string
          device_id: number
          fall_detected: boolean | null
          id: number
        }
        Insert: {
          created_at?: string
          device_id: number
          fall_detected?: boolean | null
          id?: number
        }
        Update: {
          created_at?: string
          device_id?: number
          fall_detected?: boolean | null
          id?: number
        }
        Relationships: []
      }
      heartrate: {
        Row: {
          created_at: string
          device_id: string
          heart_rate: number | null
          id: number
          spo2: number | null
        }
        Insert: {
          created_at?: string
          device_id: string
          heart_rate?: number | null
          id?: number
          spo2?: number | null
        }
        Update: {
          created_at?: string
          device_id?: string
          heart_rate?: number | null
          id?: number
          spo2?: number | null
        }
        Relationships: []
      }
      locationdata: {
        Row: {
          created_at: string
          device_id: string | null
          id: number
          latitude: number | null
          longitude: number | null
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          id?: number
          latitude?: number | null
          longitude?: number | null
        }
        Update: {
          created_at?: string
          device_id?: string | null
          id?: number
          latitude?: number | null
          longitude?: number | null
        }
        Relationships: []
      }
      motion_data: {
        Row: {
          accel_x: number | null
          accel_y: number | null
          accel_z: number | null
          created_at: string
          device_id: string
          gyro_x: number | null
          gyro_y: number | null
          gyro_z: number | null
          id: number
          temperature: number | null
        }
        Insert: {
          accel_x?: number | null
          accel_y?: number | null
          accel_z?: number | null
          created_at?: string
          device_id: string
          gyro_x?: number | null
          gyro_y?: number | null
          gyro_z?: number | null
          id?: number
          temperature?: number | null
        }
        Update: {
          accel_x?: number | null
          accel_y?: number | null
          accel_z?: number | null
          created_at?: string
          device_id?: string
          gyro_x?: number | null
          gyro_y?: number | null
          gyro_z?: number | null
          id?: number
          temperature?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          device_identifier: string | null
          email: string
          id: string
          name: string
          password: string
          role: string
        }
        Insert: {
          created_at?: string
          device_identifier?: string | null
          email: string
          id: string
          name: string
          password: string
          role: string
        }
        Update: {
          created_at?: string
          device_identifier?: string | null
          email?: string
          id?: string
          name?: string
          password?: string
          role?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
