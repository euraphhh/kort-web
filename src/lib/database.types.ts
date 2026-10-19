
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "appointment": {
                  Row: {
                    "auto_closed": boolean,"barbershop_id": string,"confirmed": boolean,"created_at": string,"created_by": string | null,"customer_id": string,"duration_minutes": number,"ends_at": string,"id": string,"price_cents": number,"professional_id": string,"service_id": string,"source": string,"starts_at": string,"status": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "auto_closed"?: boolean,"barbershop_id": string,"confirmed"?: boolean,"created_at"?: string,"created_by"?: string | null,"customer_id": string,"duration_minutes": number,"ends_at": string,"id"?: string,"price_cents": number,"professional_id": string,"service_id": string,"source": string,"starts_at": string,"status"?: string,"updated_at"?: string
                  }
                  Update: {
                    "auto_closed"?: boolean,"barbershop_id"?: string,"confirmed"?: boolean,"created_at"?: string,"created_by"?: string | null,"customer_id"?: string,"duration_minutes"?: number,"ends_at"?: string,"id"?: string,"price_cents"?: number,"professional_id"?: string,"service_id"?: string,"source"?: string,"starts_at"?: string,"status"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "appointment_barbershop_id_customer_id_fkey"
      columns: ["barbershop_id","customer_id"]
isOneToOne: false
      referencedRelation: "customer"
      referencedColumns: ["barbershop_id","id"]
    },{
      foreignKeyName: "appointment_barbershop_id_fkey"
      columns: ["barbershop_id"]
isOneToOne: false
      referencedRelation: "barbershop"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "appointment_barbershop_id_fkey"
      columns: ["barbershop_id"]
isOneToOne: false
      referencedRelation: "barbershop_summary"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "appointment_barbershop_id_professional_id_fkey"
      columns: ["barbershop_id","professional_id"]
isOneToOne: false
      referencedRelation: "professional"
      referencedColumns: ["barbershop_id","id"]
    },{
      foreignKeyName: "appointment_barbershop_id_service_id_fkey"
      columns: ["barbershop_id","service_id"]
isOneToOne: false
      referencedRelation: "service"
      referencedColumns: ["barbershop_id","id"]
    }
                  ]
                },"barbershop": {
                  Row: {
                    "address": string | null,"agent_enabled": boolean,"cancel_limit_minutes": number,"created_at": string,"default_ddd": string | null,"id": string,"max_advance_days": number,"min_notice_minutes": number,"name": string,"updated_at": string,"whatsapp_connection_status": string,"whatsapp_phone_number": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "address"?: string | null,"agent_enabled"?: boolean,"cancel_limit_minutes"?: number,"created_at"?: string,"default_ddd"?: string | null,"id"?: string,"max_advance_days"?: number,"min_notice_minutes"?: number,"name": string,"updated_at"?: string,"whatsapp_connection_status"?: string,"whatsapp_phone_number"?: string | null
                  }
                  Update: {
                    "address"?: string | null,"agent_enabled"?: boolean,"cancel_limit_minutes"?: number,"created_at"?: string,"default_ddd"?: string | null,"id"?: string,"max_advance_days"?: number,"min_notice_minutes"?: number,"name"?: string,"updated_at"?: string,"whatsapp_connection_status"?: string,"whatsapp_phone_number"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"barbershop_member": {
                  Row: {
                    "barbershop_id": string,"created_at": string,"id": string,"professional_id": string | null,"role": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "barbershop_id": string,"created_at"?: string,"id"?: string,"professional_id"?: string | null,"role": string,"user_id": string
                  }
                  Update: {
                    "barbershop_id"?: string,"created_at"?: string,"id"?: string,"professional_id"?: string | null,"role"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "barbershop_member_barbershop_id_fkey"
      columns: ["barbershop_id"]
isOneToOne: false
      referencedRelation: "barbershop"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "barbershop_member_barbershop_id_fkey"
      columns: ["barbershop_id"]
isOneToOne: false
      referencedRelation: "barbershop_summary"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "barbershop_member_professional_fk"
      columns: ["barbershop_id","professional_id"]
isOneToOne: false
      referencedRelation: "professional"
      referencedColumns: ["barbershop_id","id"]
    }
                  ]
                },"business_hours": {
                  Row: {
                    "barbershop_id": string,"created_at": string,"end_time": string,"id": string,"start_time": string,"weekday": number
                  }
                  ComputedFields: never
                  Insert: {
                    "barbershop_id": string,"created_at"?: string,"end_time": string,"id"?: string,"start_time": string,"weekday": number
                  }
                  Update: {
                    "barbershop_id"?: string,"created_at"?: string,"end_time"?: string,"id"?: string,"start_time"?: string,"weekday"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "business_hours_barbershop_id_fkey"
      columns: ["barbershop_id"]
isOneToOne: false
      referencedRelation: "barbershop"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "business_hours_barbershop_id_fkey"
      columns: ["barbershop_id"]
isOneToOne: false
      referencedRelation: "barbershop_summary"
      referencedColumns: ["id"]
    }
                  ]
                },"customer": {
                  Row: {
                    "active": boolean,"barbershop_id": string,"created_at": string,"id": string,"name": string,"opted_out": boolean,"phone": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"barbershop_id": string,"created_at"?: string,"id"?: string,"name": string,"opted_out"?: boolean,"phone": string,"updated_at"?: string
                  }
                  Update: {
                    "active"?: boolean,"barbershop_id"?: string,"created_at"?: string,"id"?: string,"name"?: string,"opted_out"?: boolean,"phone"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "customer_barbershop_id_fkey"
      columns: ["barbershop_id"]
isOneToOne: false
      referencedRelation: "barbershop"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "customer_barbershop_id_fkey"
      columns: ["barbershop_id"]
isOneToOne: false
      referencedRelation: "barbershop_summary"
      referencedColumns: ["id"]
    }
                  ]
                },"invite": {
                  Row: {
                    "accepted_at": string | null,"barbershop_id": string,"created_at": string,"created_by": string | null,"expires_at": string,"id": string,"professional_id": string,"token": string
                  }
                  ComputedFields: never
                  Insert: {
                    "accepted_at"?: string | null,"barbershop_id": string,"created_at"?: string,"created_by"?: string | null,"expires_at"?: string,"id"?: string,"professional_id": string,"token"?: string
                  }
                  Update: {
                    "accepted_at"?: string | null,"barbershop_id"?: string,"created_at"?: string,"created_by"?: string | null,"expires_at"?: string,"id"?: string,"professional_id"?: string,"token"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "invite_barbershop_id_fkey"
      columns: ["barbershop_id"]
isOneToOne: false
      referencedRelation: "barbershop"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "invite_barbershop_id_fkey"
      columns: ["barbershop_id"]
isOneToOne: false
      referencedRelation: "barbershop_summary"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "invite_professional_fk"
      columns: ["barbershop_id","professional_id"]
isOneToOne: false
      referencedRelation: "professional"
      referencedColumns: ["barbershop_id","id"]
    }
                  ]
                },"professional": {
                  Row: {
                    "active": boolean,"barbershop_id": string,"created_at": string,"id": string,"name": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"barbershop_id": string,"created_at"?: string,"id"?: string,"name": string,"updated_at"?: string
                  }
                  Update: {
                    "active"?: boolean,"barbershop_id"?: string,"created_at"?: string,"id"?: string,"name"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "professional_barbershop_id_fkey"
      columns: ["barbershop_id"]
isOneToOne: false
      referencedRelation: "barbershop"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "professional_barbershop_id_fkey"
      columns: ["barbershop_id"]
isOneToOne: false
      referencedRelation: "barbershop_summary"
      referencedColumns: ["id"]
    }
                  ]
                },"professional_hours": {
                  Row: {
                    "barbershop_id": string,"created_at": string,"end_time": string,"id": string,"professional_id": string,"start_time": string,"weekday": number
                  }
                  ComputedFields: never
                  Insert: {
                    "barbershop_id": string,"created_at"?: string,"end_time": string,"id"?: string,"professional_id": string,"start_time": string,"weekday": number
                  }
                  Update: {
                    "barbershop_id"?: string,"created_at"?: string,"end_time"?: string,"id"?: string,"professional_id"?: string,"start_time"?: string,"weekday"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "professional_hours_barbershop_id_professional_id_fkey"
      columns: ["barbershop_id","professional_id"]
isOneToOne: false
      referencedRelation: "professional"
      referencedColumns: ["barbershop_id","id"]
    }
                  ]
                },"professional_service": {
                  Row: {
                    "barbershop_id": string,"created_at": string,"duration_minutes": number | null,"price_cents": number | null,"professional_id": string,"service_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "barbershop_id": string,"created_at"?: string,"duration_minutes"?: number | null,"price_cents"?: number | null,"professional_id": string,"service_id": string
                  }
                  Update: {
                    "barbershop_id"?: string,"created_at"?: string,"duration_minutes"?: number | null,"price_cents"?: number | null,"professional_id"?: string,"service_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "professional_service_barbershop_id_professional_id_fkey"
      columns: ["barbershop_id","professional_id"]
isOneToOne: false
      referencedRelation: "professional"
      referencedColumns: ["barbershop_id","id"]
    },{
      foreignKeyName: "professional_service_barbershop_id_service_id_fkey"
      columns: ["barbershop_id","service_id"]
isOneToOne: false
      referencedRelation: "service"
      referencedColumns: ["barbershop_id","id"]
    }
                  ]
                },"schedule_block": {
                  Row: {
                    "barbershop_id": string,"created_at": string,"created_by": string | null,"ends_at": string,"id": string,"professional_id": string,"reason": string | null,"starts_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "barbershop_id": string,"created_at"?: string,"created_by"?: string | null,"ends_at": string,"id"?: string,"professional_id": string,"reason"?: string | null,"starts_at": string
                  }
                  Update: {
                    "barbershop_id"?: string,"created_at"?: string,"created_by"?: string | null,"ends_at"?: string,"id"?: string,"professional_id"?: string,"reason"?: string | null,"starts_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "schedule_block_barbershop_id_professional_id_fkey"
      columns: ["barbershop_id","professional_id"]
isOneToOne: false
      referencedRelation: "professional"
      referencedColumns: ["barbershop_id","id"]
    }
                  ]
                },"service": {
                  Row: {
                    "active": boolean,"barbershop_id": string,"created_at": string,"duration_minutes": number,"id": string,"name": string,"price_cents": number,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"barbershop_id": string,"created_at"?: string,"duration_minutes": number,"id"?: string,"name": string,"price_cents": number,"updated_at"?: string
                  }
                  Update: {
                    "active"?: boolean,"barbershop_id"?: string,"created_at"?: string,"duration_minutes"?: number,"id"?: string,"name"?: string,"price_cents"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "service_barbershop_id_fkey"
      columns: ["barbershop_id"]
isOneToOne: false
      referencedRelation: "barbershop"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "service_barbershop_id_fkey"
      columns: ["barbershop_id"]
isOneToOne: false
      referencedRelation: "barbershop_summary"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            "barbershop_summary": {
                  Row: {
                    "id": string | null,"name": string | null
                  }
                  ComputedFields: never
                  Insert: {
                           "id"?: string | null,"name"?: string | null
                         }
                        Update: {
                           "id"?: string | null,"name"?: string | null
                         }
                        Relationships: [
                    
                  ]
                }
          }
          Functions: {
            "barber_serves_customer":
{ Args: { "p_barbershop_id": string,"p_customer_id": string }; Returns: boolean
                           },
"find_or_create_customer":
{ Args: { "p_barbershop_id": string,"p_name": string,"p_phone": string }; Returns: string
                           },
"is_member":
{ Args: { "p_barbershop_id": string }; Returns: boolean
                           },
"is_owner":
{ Args: { "p_barbershop_id": string }; Returns: boolean
                           },
"is_staff":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"member_professional_id":
{ Args: { "p_barbershop_id": string }; Returns: string
                           }
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

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            
          }
        }
} as const
