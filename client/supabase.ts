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
      class_knowledge_graph: {
        Row: {
          class_id: number | null
          edges: string[] | null
          graph_id: number
          nodes: string[] | null
          react_flow_data: Json[] | null
        }
        Insert: {
          class_id?: number | null
          edges?: string[] | null
          graph_id?: never
          nodes?: string[] | null
          react_flow_data?: Json[] | null
        }
        Update: {
          class_id?: number | null
          edges?: string[] | null
          graph_id?: never
          nodes?: string[] | null
          react_flow_data?: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "class_knowledge_graph_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: true
            referencedRelation: "classes"
            referencedColumns: ["class_id"]
          },
        ]
      }
      class_lesson_bank: {
        Row: {
          class_id: number
          lesson_id: number
          owner_id: string
        }
        Insert: {
          class_id: number
          lesson_id: number
          owner_id: string
        }
        Update: {
          class_id?: number
          lesson_id?: number
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_lesson_bank_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "class_lesson_bank_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "class_lesson_bank_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["professor_id"]
          },
        ]
      }
      class_question_bank: {
        Row: {
          class_id: number
          owner_id: string
          question_id: number
        }
        Insert: {
          class_id: number
          owner_id: string
          question_id: number
        }
        Update: {
          class_id?: number
          owner_id?: string
          question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "class_question_bank_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "class_question_bank_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["professor_id"]
          },
          {
            foreignKeyName: "class_question_bank_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["question_id"]
          },
        ]
      }
      classes: {
        Row: {
          class_id: number
          description: string | null
          name: string | null
          section_number: string | null
        }
        Insert: {
          class_id?: never
          description?: string | null
          name?: string | null
          section_number?: string | null
        }
        Update: {
          class_id?: never
          description?: string | null
          name?: string | null
          section_number?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          class_id: number
          student_id: number
        }
        Insert: {
          class_id: number
          student_id: number
        }
        Update: {
          class_id?: number
          student_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      lesson_question_bank: {
        Row: {
          lesson_id: number
          owner_id: string
          question_id: number
        }
        Insert: {
          lesson_id: number
          owner_id: string
          question_id: number
        }
        Update: {
          lesson_id?: number
          owner_id?: string
          question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_question_bank_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "lesson_question_bank_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["professor_id"]
          },
          {
            foreignKeyName: "lesson_question_bank_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["question_id"]
          },
        ]
      }
      lessons: {
        Row: {
          is_draft: boolean | null
          lesson_id: number
          name: string | null
          topics: string[] | null
        }
        Insert: {
          is_draft?: boolean | null
          lesson_id?: never
          name?: string | null
          topics?: string[] | null
        }
        Update: {
          is_draft?: boolean | null
          lesson_id?: never
          name?: string | null
          topics?: string[] | null
        }
        Relationships: []
      }
      professor_courses: {
        Row: {
          class_id: number
          owner_id: string
        }
        Insert: {
          class_id: number
          owner_id: string
        }
        Update: {
          class_id?: number
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "professor_courses_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "professor_courses_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["professor_id"]
          },
        ]
      }
      professors: {
        Row: {
          name: string | null
          professor_id: string
        }
        Insert: {
          name?: string | null
          professor_id: string
        }
        Update: {
          name?: string | null
          professor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "professors_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          answer: string | null
          answer_options: string[] | null
          prompt: string | null
          question_id: number
          question_type: string | null
          snippet: string | null
          topics: string[] | null
        }
        Insert: {
          answer?: string | null
          answer_options?: string[] | null
          prompt?: string | null
          question_id?: never
          question_type?: string | null
          snippet?: string | null
          topics?: string[] | null
        }
        Update: {
          answer?: string | null
          answer_options?: string[] | null
          prompt?: string | null
          question_id?: never
          question_type?: string | null
          snippet?: string | null
          topics?: string[] | null
        }
        Relationships: []
      }
      student_knowledge_graph: {
        Row: {
          class_id: number | null
          edges: string[] | null
          graph_id: number
          nodes: string[] | null
          react_flow_data: Json[] | null
          student_id: number | null
        }
        Insert: {
          class_id?: number | null
          edges?: string[] | null
          graph_id?: never
          nodes?: string[] | null
          react_flow_data?: Json[] | null
          student_id?: number | null
        }
        Update: {
          class_id?: number | null
          edges?: string[] | null
          graph_id?: never
          nodes?: string[] | null
          react_flow_data?: Json[] | null
          student_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_knowledge_graph_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "student_knowledge_graph_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      students: {
        Row: {
          name: string | null
          student_id: number
        }
        Insert: {
          name?: string | null
          student_id?: never
        }
        Update: {
          name?: string | null
          student_id?: never
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
