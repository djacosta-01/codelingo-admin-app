export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      class_knowledge_graph: {
        Row: {
          class_id: number
          edges: string[]
          graph_id: number
          nodes: string[]
          react_flow_data: Json[]
        }
        Insert: {
          class_id: number
          edges: string[]
          graph_id?: number
          nodes: string[]
          react_flow_data: Json[]
        }
        Update: {
          class_id?: number
          edges?: string[]
          graph_id?: number
          nodes?: string[]
          react_flow_data?: Json[]
        }
        Relationships: []
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
            foreignKeyName: 'class_lesson_bank_lesson_id_fkey'
            columns: ['lesson_id']
            isOneToOne: false
            referencedRelation: 'lessons'
            referencedColumns: ['lesson_id']
          }
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
            foreignKeyName: 'class_question_bank_question_id_fkey'
            columns: ['question_id']
            isOneToOne: false
            referencedRelation: 'questions'
            referencedColumns: ['question_id']
          }
        ]
      }
      classes: {
        Row: {
          class_id: number
          description: string | null
          name: string
          section_number: string
        }
        Insert: {
          class_id?: never
          description?: string | null
          name: string
          section_number: string
        }
        Update: {
          class_id?: never
          description?: string | null
          name?: string
          section_number?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          class_id: number
          student_id: string
        }
        Insert: {
          class_id: number
          student_id: string
        }
        Update: {
          class_id?: number
          student_id?: string
        }
        Relationships: []
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
            foreignKeyName: 'lesson_question_bank_lesson_id_fkey'
            columns: ['lesson_id']
            isOneToOne: false
            referencedRelation: 'lessons'
            referencedColumns: ['lesson_id']
          },
          {
            foreignKeyName: 'lesson_question_bank_question_id_fkey'
            columns: ['question_id']
            isOneToOne: false
            referencedRelation: 'questions'
            referencedColumns: ['question_id']
          }
        ]
      }
      lessons: {
        Row: {
          lesson_id: number
          name: string
          topics: string[]
        }
        Insert: {
          lesson_id?: never
          name: string
          topics: string[]
        }
        Update: {
          lesson_id?: never
          name?: string
          topics?: string[]
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
        Relationships: []
      }
      professors: {
        Row: {
          professor_id: string
        }
        Insert: {
          professor_id: string
        }
        Update: {
          professor_id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          answer: string
          answer_options: string[]
          prompt: string
          question_id: number
          question_type: string
          snippet: string | null
          topics: string[]
        }
        Insert: {
          answer: string
          answer_options: string[]
          prompt: string
          question_id?: never
          question_type: string
          snippet?: string | null
          topics: string[]
        }
        Update: {
          answer?: string
          answer_options?: string[]
          prompt?: string
          question_id?: never
          question_type?: string
          snippet?: string | null
          topics?: string[]
        }
        Relationships: []
      }
      student_knowledge_graph: {
        Row: {
          class_id: number
          edges: string[]
          graph_id: number
          nodes: string[]
          react_flow_data: Json[]
          student_id: string
        }
        Insert: {
          class_id: number
          edges: string[]
          graph_id?: number
          nodes: string[]
          react_flow_data: Json[]
          student_id: string
        }
        Update: {
          class_id?: number
          edges?: string[]
          graph_id?: number
          nodes?: string[]
          react_flow_data?: Json[]
          student_id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          student_id: string
        }
        Insert: {
          student_id: string
        }
        Update: {
          student_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      insert_user_into_respective_table: {
        Args: {
          user_type: string
          user_id: string
        }
        Returns: boolean
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

type PublicSchema = Database[Extract<keyof Database, 'public'>]

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
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
  ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never
