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
      Medication: {
        Row: {
          created_at: string
          dosage: number
          end_date: string | null
          frequency: number
          id: number
          instructions: string | null
          medication_name: string
          pill_count: number
          prescription_id: number
          start_date: string
        }
        Insert: {
          created_at?: string
          dosage: number
          end_date?: string | null
          frequency: number
          id?: number
          instructions?: string | null
          medication_name: string
          pill_count: number
          prescription_id: number
          start_date: string
        }
        Update: {
          created_at?: string
          dosage?: number
          end_date?: string | null
          frequency?: number
          id?: number
          instructions?: string | null
          medication_name?: string
          pill_count?: number
          prescription_id?: number
          start_date?: string
        }
        Relationships: []
      }
      MedicationSchedule: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_taken: boolean
          prescription_id: number
          scheduled_time: string
          taken_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_taken?: boolean
          prescription_id: number
          scheduled_time: string
          taken_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_taken?: boolean
          prescription_id?: number
          scheduled_time?: string
          taken_at?: string | null
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
      Notification: {
        Row: {
          created_at: string
          id: number
          is_read: boolean
          link_URL: string | null
          message: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_read?: boolean
          link_URL?: string | null
          message?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          is_read?: boolean
          link_URL?: string | null
          message?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      Prescription: {
        Row: {
          created_at: string
          id: number
          name: string
          statusClosed: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          statusClosed?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          statusClosed?: boolean
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          device_identifier: string | null
          email: string
          id: string
          isVerified: boolean
          name: string
          password: string
          phone_number: string | null
          role: string
          verificationToken: string | null
        }
        Insert: {
          created_at?: string
          device_identifier?: string | null
          email: string
          id: string
          isVerified?: boolean
          name: string
          password: string
          phone_number?: string | null
          role: string
          verificationToken?: string | null
        }
        Update: {
          created_at?: string
          device_identifier?: string | null
          email?: string
          id?: string
          isVerified?: boolean
          name?: string
          password?: string
          phone_number?: string | null
          role?: string
          verificationToken?: string | null
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
    Enums: {},
  },
} as const
