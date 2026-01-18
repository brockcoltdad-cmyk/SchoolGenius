export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string | null
          coin_reward: number | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_secret: boolean | null
          name: string
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          category?: string | null
          coin_reward?: number | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_secret?: boolean | null
          name: string
          requirement_type: string
          requirement_value: number
        }
        Update: {
          category?: string | null
          coin_reward?: number | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_secret?: boolean | null
          name?: string
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      avatar_items: {
        Row: {
          category: string
          coin_cost: number | null
          created_at: string | null
          icon: string
          id: string
          is_free: boolean | null
          name: string
        }
        Insert: {
          category: string
          coin_cost?: number | null
          created_at?: string | null
          icon: string
          id?: string
          is_free?: boolean | null
          name: string
        }
        Update: {
          category?: string
          coin_cost?: number | null
          created_at?: string | null
          icon?: string
          id?: string
          is_free?: boolean | null
          name?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          badge_icon: string
          badge_name: string
          child_id: string | null
          earned_at: string | null
          id: string
        }
        Insert: {
          badge_icon: string
          badge_name: string
          child_id?: string | null
          earned_at?: string | null
          id?: string
        }
        Update: {
          badge_icon?: string
          badge_name?: string
          child_id?: string | null
          earned_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "badges_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      child_avatar: {
        Row: {
          accessory: string | null
          background: string | null
          child_id: string | null
          created_at: string | null
          hair: string | null
          id: string
          shirt: string | null
          skin: string | null
        }
        Insert: {
          accessory?: string | null
          background?: string | null
          child_id?: string | null
          created_at?: string | null
          hair?: string | null
          id?: string
          shirt?: string | null
          skin?: string | null
        }
        Update: {
          accessory?: string | null
          background?: string | null
          child_id?: string | null
          created_at?: string | null
          hair?: string | null
          id?: string
          shirt?: string | null
          skin?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "child_avatar_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      child_owned_items: {
        Row: {
          child_id: string | null
          id: string
          item_id: string | null
          purchased_at: string | null
        }
        Insert: {
          child_id?: string | null
          id?: string
          item_id?: string | null
          purchased_at?: string | null
        }
        Update: {
          child_id?: string | null
          id?: string
          item_id?: string | null
          purchased_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "child_owned_items_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_owned_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "avatar_items"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          age: number | null
          avatar: string | null
          coins: number | null
          created_at: string | null
          current_streak: number | null
          current_theme: string | null
          grade: string | null
          grade_level: string | null
          id: string
          interests: string[] | null
          last_activity_date: string | null
          level: number | null
          longest_streak: number | null
          name: string
          parent_id: string | null
          pin: string | null
          pin_code: string | null
          pin_required: boolean | null
          points: number | null
          streak: number | null
          updated_at: string | null
          xp: number | null
        }
        Insert: {
          age?: number | null
          avatar?: string | null
          coins?: number | null
          created_at?: string | null
          current_streak?: number | null
          current_theme?: string | null
          grade?: string | null
          grade_level?: string | null
          id?: string
          interests?: string[] | null
          last_activity_date?: string | null
          level?: number | null
          longest_streak?: number | null
          name: string
          parent_id?: string | null
          pin?: string | null
          pin_code?: string | null
          pin_required?: boolean | null
          points?: number | null
          streak?: number | null
          updated_at?: string | null
          xp?: number | null
        }
        Update: {
          age?: number | null
          avatar?: string | null
          coins?: number | null
          created_at?: string | null
          current_streak?: number | null
          current_theme?: string | null
          grade?: string | null
          grade_level?: string | null
          id?: string
          interests?: string[] | null
          last_activity_date?: string | null
          level?: number | null
          longest_streak?: number | null
          name?: string
          parent_id?: string | null
          pin?: string | null
          pin_code?: string | null
          pin_required?: boolean | null
          points?: number | null
          streak?: number | null
          updated_at?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      coin_transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          lesson_id: string | null
          reason: string
          student_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          reason: string
          student_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          reason?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coin_transactions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coin_transactions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "coin_transactions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      coins_transactions: {
        Row: {
          amount: number
          balance_after: number | null
          child_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          reason: string
          transaction_type: string | null
        }
        Insert: {
          amount: number
          balance_after?: number | null
          child_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          reason: string
          transaction_type?: string | null
        }
        Update: {
          amount?: number
          balance_after?: number | null
          child_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          reason?: string
          transaction_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coins_transactions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_lessons: {
        Row: {
          content_type: string | null
          created_at: string | null
          estimated_minutes: number | null
          id: string
          lesson_number: number | null
          lesson_objective: string | null
          lesson_title: string
          sequence_order: number | null
          unit_id: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          estimated_minutes?: number | null
          id?: string
          lesson_number?: number | null
          lesson_objective?: string | null
          lesson_title: string
          sequence_order?: number | null
          unit_id?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          estimated_minutes?: number | null
          id?: string
          lesson_number?: number | null
          lesson_objective?: string | null
          lesson_title?: string
          sequence_order?: number | null
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_lessons_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "curriculum_units"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_skills: {
        Row: {
          created_at: string | null
          description: string | null
          grade_level: number | null
          id: string
          skill_name: string
          skill_order: number | null
          subject_code: string | null
          subject_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          grade_level?: number | null
          id?: string
          skill_name: string
          skill_order?: number | null
          subject_code?: string | null
          subject_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          grade_level?: number | null
          id?: string
          skill_name?: string
          skill_order?: number | null
          subject_code?: string | null
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_skills_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "curriculum_subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_subjects: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      curriculum_units: {
        Row: {
          created_at: string | null
          estimated_days: number | null
          grade: string
          id: string
          sequence_order: number | null
          standards_covered: string[] | null
          state_code: string | null
          subject: string
          unit_description: string | null
          unit_number: number | null
          unit_title: string
        }
        Insert: {
          created_at?: string | null
          estimated_days?: number | null
          grade: string
          id?: string
          sequence_order?: number | null
          standards_covered?: string[] | null
          state_code?: string | null
          subject: string
          unit_description?: string | null
          unit_number?: number | null
          unit_title: string
        }
        Update: {
          created_at?: string | null
          estimated_days?: number | null
          grade?: string
          id?: string
          sequence_order?: number | null
          standards_covered?: string[] | null
          state_code?: string | null
          subject?: string
          unit_description?: string | null
          unit_number?: number | null
          unit_title?: string
        }
        Relationships: []
      }
      custom_rewards: {
        Row: {
          category: string | null
          coin_cost: number
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
        }
        Insert: {
          category?: string | null
          coin_cost: number
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
        }
        Update: {
          category?: string | null
          coin_cost?: number
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
        }
        Relationships: []
      }
      custom_syllabus: {
        Row: {
          id: string
          child_id: string
          subjects: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          child_id: string
          subjects: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          child_id?: string
          subjects?: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_syllabus_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_streaks: {
        Row: {
          coins_earned: number | null
          created_at: string | null
          date: string
          id: string
          lessons_completed: number | null
          student_id: string | null
        }
        Insert: {
          coins_earned?: number | null
          created_at?: string | null
          date: string
          id?: string
          lessons_completed?: number | null
          student_id?: string | null
        }
        Update: {
          coins_earned?: number | null
          created_at?: string | null
          date?: string
          id?: string
          lessons_completed?: number | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_streaks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "daily_streaks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_schedule: {
        Row: {
          id: string
          child_id: string
          date: string
          subject_code: string | null
          lesson_title: string | null
          from_syllabus: boolean
          completed: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          child_id: string
          date: string
          subject_code?: string | null
          lesson_title?: string | null
          from_syllabus?: boolean
          completed?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          child_id?: string
          date?: string
          subject_code?: string | null
          lesson_title?: string | null
          from_syllabus?: boolean
          completed?: boolean
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_schedule_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      default_syllabi: {
        Row: {
          created_at: string | null
          days_per_year: number | null
          grade: string
          hours_per_day: number | null
          id: string
          is_active: boolean | null
          name: string
          state_code: string
          subjects: Json | null
          time_blocks: Json | null
        }
        Insert: {
          created_at?: string | null
          days_per_year?: number | null
          grade: string
          hours_per_day?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          state_code: string
          subjects?: Json | null
          time_blocks?: Json | null
        }
        Update: {
          created_at?: string | null
          days_per_year?: number | null
          grade?: string
          hours_per_day?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          state_code?: string
          subjects?: Json | null
          time_blocks?: Json | null
        }
        Relationships: []
      }
      encouragement_messages: {
        Row: {
          audio_script: string | null
          category: string
          created_at: string | null
          emoji: string | null
          id: string
          max_score: number | null
          message_text: string
          min_score: number | null
          streak_count: number | null
        }
        Insert: {
          audio_script?: string | null
          category: string
          created_at?: string | null
          emoji?: string | null
          id?: string
          max_score?: number | null
          message_text: string
          min_score?: number | null
          streak_count?: number | null
        }
        Update: {
          audio_script?: string | null
          category?: string
          created_at?: string | null
          emoji?: string | null
          id?: string
          max_score?: number | null
          message_text?: string
          min_score?: number | null
          streak_count?: number | null
        }
        Relationships: []
      }
      explanation_library: {
        Row: {
          audio_url: string | null
          created_at: string | null
          explanation_text: string
          explanation_type: string
          id: string
          skill_id: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          explanation_text: string
          explanation_type: string
          id?: string
          skill_id?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          explanation_text?: string
          explanation_type?: string
          id?: string
          skill_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "explanation_library_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "curriculum_skills"
            referencedColumns: ["id"]
          },
        ]
      }
      families: {
        Row: {
          id: string
          user_id: string
          name: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      foundation_progress: {
        Row: {
          attempts: number | null
          created_at: string | null
          id: string
          last_practiced: string | null
          mastery_level: number | null
          student_id: string | null
          subject_id: string | null
          topic: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          id?: string
          last_practiced?: string | null
          mastery_level?: number | null
          student_id?: string | null
          subject_id?: string | null
          topic: string
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          id?: string
          last_practiced?: string | null
          mastery_level?: number | null
          student_id?: string | null
          subject_id?: string | null
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "foundation_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "foundation_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_stories: {
        Row: {
          audience: string
          content: string
          created_at: string | null
          estimated_read_time: number | null
          grade_group: string
          id: string
          is_active: boolean | null
          lexile_level: number
          source: string | null
          theme: string
          times_read: number | null
          title: string
          topic: string
          word_count: number | null
        }
        Insert: {
          audience: string
          content: string
          created_at?: string | null
          estimated_read_time?: number | null
          grade_group: string
          id?: string
          is_active?: boolean | null
          lexile_level: number
          source?: string | null
          theme: string
          times_read?: number | null
          title: string
          topic: string
          word_count?: number | null
        }
        Update: {
          audience?: string
          content?: string
          created_at?: string | null
          estimated_read_time?: number | null
          grade_group?: string
          id?: string
          is_active?: boolean | null
          lexile_level?: number
          source?: string | null
          theme?: string
          times_read?: number | null
          title?: string
          topic?: string
          word_count?: number | null
        }
        Relationships: []
      }
      generation_progress: {
        Row: {
          batch_date: string | null
          batch_name: string
          completed_at: string | null
          completed_items: number | null
          created_at: string | null
          failed_items: number | null
          id: string
          log_messages: Json | null
          started_at: string | null
          status: string | null
          total_items: number | null
        }
        Insert: {
          batch_date?: string | null
          batch_name: string
          completed_at?: string | null
          completed_items?: number | null
          created_at?: string | null
          failed_items?: number | null
          id?: string
          log_messages?: Json | null
          started_at?: string | null
          status?: string | null
          total_items?: number | null
        }
        Update: {
          batch_date?: string | null
          batch_name?: string
          completed_at?: string | null
          completed_items?: number | null
          created_at?: string | null
          failed_items?: number | null
          id?: string
          log_messages?: Json | null
          started_at?: string | null
          status?: string | null
          total_items?: number | null
        }
        Relationships: []
      }
      generation_queue: {
        Row: {
          attempts: number | null
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          generation_type: string
          grade_level: number | null
          id: string
          max_attempts: number | null
          priority: number | null
          skill_code: string | null
          started_at: string | null
          status: string | null
          story_id: string | null
          subject_code: string | null
        }
        Insert: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          generation_type: string
          grade_level?: number | null
          id?: string
          max_attempts?: number | null
          priority?: number | null
          skill_code?: string | null
          started_at?: string | null
          status?: string | null
          story_id?: string | null
          subject_code?: string | null
        }
        Update: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          generation_type?: string
          grade_level?: number | null
          id?: string
          max_attempts?: number | null
          priority?: number | null
          skill_code?: string | null
          started_at?: string | null
          status?: string | null
          story_id?: string | null
          subject_code?: string | null
        }
        Relationships: []
      }
      gigi_chats: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          message: string
          sender: string
          student_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          message: string
          sender: string
          student_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          message?: string
          sender?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gigi_chats_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "gigi_chats_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      kid_assessments: {
        Row: {
          assessed_at: string | null
          assessment_type: string | null
          id: string
          notes: string | null
          score: number | null
          score_label: string | null
          student_id: string | null
        }
        Insert: {
          assessed_at?: string | null
          assessment_type?: string | null
          id?: string
          notes?: string | null
          score?: number | null
          score_label?: string | null
          student_id?: string | null
        }
        Update: {
          assessed_at?: string | null
          assessment_type?: string | null
          id?: string
          notes?: string | null
          score?: number | null
          score_label?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kid_assessments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "kid_assessments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      kid_chat_history: {
        Row: {
          id: string
          message_from: string | null
          message_text: string | null
          sent_at: string | null
          student_id: string | null
        }
        Insert: {
          id?: string
          message_from?: string | null
          message_text?: string | null
          sent_at?: string | null
          student_id?: string | null
        }
        Update: {
          id?: string
          message_from?: string | null
          message_text?: string | null
          sent_at?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kid_chat_history_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "kid_chat_history_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      kid_homework: {
        Row: {
          ai_help_sessions: number | null
          assigned_date: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          notes: string | null
          source_doc_id: string | null
          status: string | null
          student_id: string | null
          subject: string | null
          title: string | null
        }
        Insert: {
          ai_help_sessions?: number | null
          assigned_date?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          source_doc_id?: string | null
          status?: string | null
          student_id?: string | null
          subject?: string | null
          title?: string | null
        }
        Update: {
          ai_help_sessions?: number | null
          assigned_date?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          source_doc_id?: string | null
          status?: string | null
          student_id?: string | null
          subject?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kid_homework_source_doc_id_fkey"
            columns: ["source_doc_id"]
            isOneToOne: false
            referencedRelation: "kid_scanned_docs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kid_homework_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "kid_homework_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      kid_homework_help: {
        Row: {
          ai_response: string | null
          helped_at: string | null
          homework_id: string | null
          id: string
          question_asked: string | null
          scanned_doc_id: string | null
          student_id: string | null
        }
        Insert: {
          ai_response?: string | null
          helped_at?: string | null
          homework_id?: string | null
          id?: string
          question_asked?: string | null
          scanned_doc_id?: string | null
          student_id?: string | null
        }
        Update: {
          ai_response?: string | null
          helped_at?: string | null
          homework_id?: string | null
          id?: string
          question_asked?: string | null
          scanned_doc_id?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kid_homework_help_homework_id_fkey"
            columns: ["homework_id"]
            isOneToOne: false
            referencedRelation: "kid_homework"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kid_homework_help_scanned_doc_id_fkey"
            columns: ["scanned_doc_id"]
            isOneToOne: false
            referencedRelation: "kid_scanned_docs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kid_homework_help_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "kid_homework_help_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      kid_lesson_history: {
        Row: {
          completed_at: string | null
          id: string
          lesson_title: string | null
          lexile_at_time: number | null
          score_percent: number | null
          started_at: string | null
          student_id: string | null
          subject: string | null
          time_spent_seconds: number | null
          topic: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          lesson_title?: string | null
          lexile_at_time?: number | null
          score_percent?: number | null
          started_at?: string | null
          student_id?: string | null
          subject?: string | null
          time_spent_seconds?: number | null
          topic?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          lesson_title?: string | null
          lexile_at_time?: number | null
          score_percent?: number | null
          started_at?: string | null
          student_id?: string | null
          subject?: string | null
          time_spent_seconds?: number | null
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kid_lesson_history_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "kid_lesson_history_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      kid_projects: {
        Row: {
          assigned_date: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          milestones: Json | null
          percent_complete: number | null
          source_doc_id: string | null
          status: string | null
          student_id: string | null
          subject: string | null
          title: string | null
        }
        Insert: {
          assigned_date?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          milestones?: Json | null
          percent_complete?: number | null
          source_doc_id?: string | null
          status?: string | null
          student_id?: string | null
          subject?: string | null
          title?: string | null
        }
        Update: {
          assigned_date?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          milestones?: Json | null
          percent_complete?: number | null
          source_doc_id?: string | null
          status?: string | null
          student_id?: string | null
          subject?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kid_projects_source_doc_id_fkey"
            columns: ["source_doc_id"]
            isOneToOne: false
            referencedRelation: "kid_scanned_docs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kid_projects_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "kid_projects_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      kid_quiz_answers: {
        Row: {
          answered_at: string | null
          correct_answer: string | null
          id: string
          is_correct: boolean | null
          kid_answer: string | null
          lesson_id: string | null
          question: string | null
          story_id: string | null
          student_id: string | null
        }
        Insert: {
          answered_at?: string | null
          correct_answer?: string | null
          id?: string
          is_correct?: boolean | null
          kid_answer?: string | null
          lesson_id?: string | null
          question?: string | null
          story_id?: string | null
          student_id?: string | null
        }
        Update: {
          answered_at?: string | null
          correct_answer?: string | null
          id?: string
          is_correct?: boolean | null
          kid_answer?: string | null
          lesson_id?: string | null
          question?: string | null
          story_id?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kid_quiz_answers_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "kid_quiz_answers_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      kid_reading_history: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          id: string
          started_at: string | null
          story_id: string | null
          story_title: string | null
          student_id: string | null
          time_spent_seconds: number | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          started_at?: string | null
          story_id?: string | null
          story_title?: string | null
          student_id?: string | null
          time_spent_seconds?: number | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          started_at?: string | null
          story_id?: string | null
          story_title?: string | null
          student_id?: string | null
          time_spent_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kid_reading_history_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "generated_stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kid_reading_history_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "kid_reading_history_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      kid_scanned_docs: {
        Row: {
          ai_summary: string | null
          doc_type: string | null
          extracted_text: string | null
          id: string
          image_url: string | null
          scanned_at: string | null
          student_id: string | null
          subject: string | null
        }
        Insert: {
          ai_summary?: string | null
          doc_type?: string | null
          extracted_text?: string | null
          id?: string
          image_url?: string | null
          scanned_at?: string | null
          student_id?: string | null
          subject?: string | null
        }
        Update: {
          ai_summary?: string | null
          doc_type?: string | null
          extracted_text?: string | null
          id?: string
          image_url?: string | null
          scanned_at?: string | null
          student_id?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kid_scanned_docs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "kid_scanned_docs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      kid_school_events: {
        Row: {
          created_at: string | null
          event_date: string | null
          event_type: string | null
          id: string
          notes: string | null
          reminder_sent: boolean | null
          source_doc_id: string | null
          student_id: string | null
          subject: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          event_date?: string | null
          event_type?: string | null
          id?: string
          notes?: string | null
          reminder_sent?: boolean | null
          source_doc_id?: string | null
          student_id?: string | null
          subject?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          event_date?: string | null
          event_type?: string | null
          id?: string
          notes?: string | null
          reminder_sent?: boolean | null
          source_doc_id?: string | null
          student_id?: string | null
          subject?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kid_school_events_source_doc_id_fkey"
            columns: ["source_doc_id"]
            isOneToOne: false
            referencedRelation: "kid_scanned_docs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kid_school_events_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "kid_school_events_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      kid_school_info: {
        Row: {
          grade: string | null
          id: string
          notes: string | null
          school_name: string | null
          school_year: string | null
          student_id: string | null
          teacher_name: string | null
          updated_at: string | null
        }
        Insert: {
          grade?: string | null
          id?: string
          notes?: string | null
          school_name?: string | null
          school_year?: string | null
          student_id?: string | null
          teacher_name?: string | null
          updated_at?: string | null
        }
        Update: {
          grade?: string | null
          id?: string
          notes?: string | null
          school_name?: string | null
          school_year?: string | null
          student_id?: string | null
          teacher_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kid_school_info_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "kid_school_info_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      kid_skill_tracking: {
        Row: {
          id: string
          last_practiced: string | null
          mastery_percent: number | null
          needs_review: boolean | null
          skill_name: string | null
          student_id: string | null
          subject: string | null
          times_correct: number | null
          times_practiced: number | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          last_practiced?: string | null
          mastery_percent?: number | null
          needs_review?: boolean | null
          skill_name?: string | null
          student_id?: string | null
          subject?: string | null
          times_correct?: number | null
          times_practiced?: number | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          last_practiced?: string | null
          mastery_percent?: number | null
          needs_review?: boolean | null
          skill_name?: string | null
          student_id?: string | null
          subject?: string | null
          times_correct?: number | null
          times_practiced?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kid_skill_tracking_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "kid_skill_tracking_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      kid_weekly_schedule: {
        Row: {
          created_at: string | null
          id: string
          source_doc_id: string | null
          student_id: string | null
          subject: string | null
          topics_this_week: string[] | null
          week_end: string | null
          week_start: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          source_doc_id?: string | null
          student_id?: string | null
          subject?: string | null
          topics_this_week?: string[] | null
          week_end?: string | null
          week_start?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          source_doc_id?: string | null
          student_id?: string | null
          subject?: string | null
          topics_this_week?: string[] | null
          week_end?: string | null
          week_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kid_weekly_schedule_source_doc_id_fkey"
            columns: ["source_doc_id"]
            isOneToOne: false
            referencedRelation: "kid_scanned_docs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kid_weekly_schedule_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "kid_weekly_schedule_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_content: {
        Row: {
          challenge_problems: Json | null
          created_at: string | null
          demo_problems: Json | null
          explanation_level_2: string | null
          explanation_level_3: string | null
          grade_level: number | null
          guided_practice: Json | null
          id: string
          independent_practice: Json | null
          mistake_patterns: Json | null
          quiz_questions: Json | null
          review_questions: Json | null
          rules_audio_script: string | null
          rules_text: string | null
          skill_code: string | null
          skill_id: string
          skill_name: string | null
          subject_code: string | null
          visual_type: string | null
        }
        Insert: {
          challenge_problems?: Json | null
          created_at?: string | null
          demo_problems?: Json | null
          explanation_level_2?: string | null
          explanation_level_3?: string | null
          grade_level?: number | null
          guided_practice?: Json | null
          id?: string
          independent_practice?: Json | null
          mistake_patterns?: Json | null
          quiz_questions?: Json | null
          review_questions?: Json | null
          rules_audio_script?: string | null
          rules_text?: string | null
          skill_code?: string | null
          skill_id: string
          skill_name?: string | null
          subject_code?: string | null
          visual_type?: string | null
        }
        Update: {
          challenge_problems?: Json | null
          created_at?: string | null
          demo_problems?: Json | null
          explanation_level_2?: string | null
          explanation_level_3?: string | null
          grade_level?: number | null
          guided_practice?: Json | null
          id?: string
          independent_practice?: Json | null
          mistake_patterns?: Json | null
          quiz_questions?: Json | null
          review_questions?: Json | null
          rules_audio_script?: string | null
          rules_text?: string | null
          skill_code?: string | null
          skill_id?: string
          skill_name?: string | null
          subject_code?: string | null
          visual_type?: string | null
        }
        Relationships: []
      }
      lesson_packages: {
        Row: {
          avg_score: number | null
          challenge_problems: Json | null
          created_at: string | null
          difficulty: number | null
          generation_error: string | null
          generation_status: string | null
          grade_level: number
          guided_practice: Json | null
          help_responses: Json | null
          id: string
          independent_practice: Json | null
          mastery_quiz: Json | null
          mistake_patterns: Json | null
          rules: Json | null
          sequence_number: number | null
          skill_code: string
          skill_name: string
          spaced_review: Json | null
          subject_code: string
          teacher_demos: Json | null
          times_accessed: number | null
          total_questions: number | null
          updated_at: string | null
        }
        Insert: {
          avg_score?: number | null
          challenge_problems?: Json | null
          created_at?: string | null
          difficulty?: number | null
          generation_error?: string | null
          generation_status?: string | null
          grade_level: number
          guided_practice?: Json | null
          help_responses?: Json | null
          id?: string
          independent_practice?: Json | null
          mastery_quiz?: Json | null
          mistake_patterns?: Json | null
          rules?: Json | null
          sequence_number?: number | null
          skill_code: string
          skill_name: string
          spaced_review?: Json | null
          subject_code: string
          teacher_demos?: Json | null
          times_accessed?: number | null
          total_questions?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_score?: number | null
          challenge_problems?: Json | null
          created_at?: string | null
          difficulty?: number | null
          generation_error?: string | null
          generation_status?: string | null
          grade_level?: number
          guided_practice?: Json | null
          help_responses?: Json | null
          id?: string
          independent_practice?: Json | null
          mastery_quiz?: Json | null
          mistake_patterns?: Json | null
          rules?: Json | null
          sequence_number?: number | null
          skill_code?: string
          skill_name?: string
          spaced_review?: Json | null
          subject_code?: string
          teacher_demos?: Json | null
          times_accessed?: number | null
          total_questions?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          coins_reward: number | null
          completed: boolean | null
          completed_at: string | null
          content: Json | null
          created_at: string | null
          difficulty: number | null
          id: string
          score: number | null
          student_id: string | null
          subject_id: string | null
          title: string
        }
        Insert: {
          coins_reward?: number | null
          completed?: boolean | null
          completed_at?: string | null
          content?: Json | null
          created_at?: string | null
          difficulty?: number | null
          id?: string
          score?: number | null
          student_id?: string | null
          subject_id?: string | null
          title: string
        }
        Update: {
          coins_reward?: number | null
          completed?: boolean | null
          completed_at?: string | null
          content?: Json | null
          created_at?: string | null
          difficulty?: number | null
          id?: string
          score?: number | null
          student_id?: string | null
          subject_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "lessons_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      monitoring_alerts: {
        Row: {
          id: string
          child_id: string
          alert_type: string
          severity: string
          title: string
          message: string
          subject_code: string | null
          is_read: boolean
          is_dismissed: boolean
          read_at: string | null
          dismissed_at: string | null
          created_at: string | null
          data: Json | null
        }
        Insert: {
          id?: string
          child_id: string
          alert_type: string
          severity: string
          title: string
          message: string
          subject_code?: string | null
          is_read?: boolean
          is_dismissed?: boolean
          read_at?: string | null
          dismissed_at?: string | null
          created_at?: string | null
          data?: Json | null
        }
        Update: {
          id?: string
          child_id?: string
          alert_type?: string
          severity?: string
          title?: string
          message?: string
          subject_code?: string | null
          is_read?: boolean
          is_dismissed?: boolean
          read_at?: string | null
          dismissed_at?: string | null
          created_at?: string | null
          data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "monitoring_alerts_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_prizes: {
        Row: {
          coin_cost: number
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
        }
        Insert: {
          coin_cost?: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
        }
        Update: {
          coin_cost?: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
        }
        Relationships: []
      }
      phillip_reports: {
        Row: {
          content_gaps: Json[] | null
          created_at: string | null
          critical_issues: Json[] | null
          date_range_end: string | null
          date_range_start: string | null
          id: string
          library_stats: Json | null
          recommendations: Json[] | null
          report_date: string
          report_type: string
          sent_at: string | null
          usage_stats: Json | null
          whats_working: Json[] | null
        }
        Insert: {
          content_gaps?: Json[] | null
          created_at?: string | null
          critical_issues?: Json[] | null
          date_range_end?: string | null
          date_range_start?: string | null
          id?: string
          library_stats?: Json | null
          recommendations?: Json[] | null
          report_date: string
          report_type: string
          sent_at?: string | null
          usage_stats?: Json | null
          whats_working?: Json[] | null
        }
        Update: {
          content_gaps?: Json[] | null
          created_at?: string | null
          critical_issues?: Json[] | null
          date_range_end?: string | null
          date_range_start?: string | null
          id?: string
          library_stats?: Json | null
          recommendations?: Json[] | null
          report_date?: string
          report_type?: string
          sent_at?: string | null
          usage_stats?: Json | null
          whats_working?: Json[] | null
        }
        Relationships: []
      }
      platform_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          page_path: string | null
          session_id: string | null
          user_id: string | null
          user_type: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          page_path?: string | null
          session_id?: string | null
          user_id?: string | null
          user_type?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          page_path?: string | null
          session_id?: string | null
          user_id?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      platform_insights: {
        Row: {
          affected_count: number | null
          affected_data: Json | null
          created_at: string | null
          description: string
          fixed_at: string | null
          id: string
          insight_type: string
          reviewed_at: string | null
          severity: string | null
          status: string | null
          suggestion: string | null
          title: string
        }
        Insert: {
          affected_count?: number | null
          affected_data?: Json | null
          created_at?: string | null
          description: string
          fixed_at?: string | null
          id?: string
          insight_type: string
          reviewed_at?: string | null
          severity?: string | null
          status?: string | null
          suggestion?: string | null
          title: string
        }
        Update: {
          affected_count?: number | null
          affected_data?: Json | null
          created_at?: string | null
          description?: string
          fixed_at?: string | null
          id?: string
          insight_type?: string
          reviewed_at?: string | null
          severity?: string | null
          status?: string | null
          suggestion?: string | null
          title?: string
        }
        Relationships: []
      }
      prize_redemptions: {
        Row: {
          fulfilled_at: string | null
          id: string
          prize_id: string | null
          redeemed_at: string | null
          status: string | null
          student_id: string | null
        }
        Insert: {
          fulfilled_at?: string | null
          id?: string
          prize_id?: string | null
          redeemed_at?: string | null
          status?: string | null
          student_id?: string | null
        }
        Update: {
          fulfilled_at?: string | null
          id?: string
          prize_id?: string | null
          redeemed_at?: string | null
          status?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prize_redemptions_prize_id_fkey"
            columns: ["prize_id"]
            isOneToOne: false
            referencedRelation: "parent_prizes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prize_redemptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "prize_redemptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          onboarding_complete: boolean | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          onboarding_complete?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          onboarding_complete?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      qa_library: {
        Row: {
          answer_text: string
          audio_url: string | null
          category: string | null
          created_at: string | null
          created_by: string | null
          grade_level: number | null
          id: string
          page_context: string | null
          question_hash: string
          question_text: string
          subcategory: string | null
          times_served: number | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          answer_text: string
          audio_url?: string | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          grade_level?: number | null
          id?: string
          page_context?: string | null
          question_hash: string
          question_text: string
          subcategory?: string | null
          times_served?: number | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          answer_text?: string
          audio_url?: string | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          grade_level?: number | null
          id?: string
          page_context?: string | null
          question_hash?: string
          question_text?: string
          subcategory?: string | null
          times_served?: number | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string
          referred_email: string | null
          referrer_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_code: string
          referred_email?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_email?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          child_id: string | null
          coin_cost: number
          id: string
          requested_at: string | null
          resolved_at: string | null
          reward_id: string | null
          status: string | null
        }
        Insert: {
          child_id?: string | null
          coin_cost: number
          id?: string
          requested_at?: string | null
          resolved_at?: string | null
          reward_id?: string | null
          status?: string | null
        }
        Update: {
          child_id?: string | null
          coin_cost?: number
          id?: string
          requested_at?: string | null
          resolved_at?: string | null
          reward_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "custom_rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      scanned_homework: {
        Row: {
          id: string
          child_id: string
          category: string
          scanned_at: string | null
          created_at: string | null
          image_url: string | null
          extracted_text: string | null
          parsed_data: Json | null
        }
        Insert: {
          id?: string
          child_id: string
          category: string
          scanned_at?: string | null
          created_at?: string | null
          image_url?: string | null
          extracted_text?: string | null
          parsed_data?: Json | null
        }
        Update: {
          id?: string
          child_id?: string
          category?: string
          scanned_at?: string | null
          created_at?: string | null
          image_url?: string | null
          extracted_text?: string | null
          parsed_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "scanned_homework_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_items: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          preview_data: Json | null
          price: number
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          preview_data?: Json | null
          price: number
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          preview_data?: Json | null
          price?: number
        }
        Relationships: []
      }
      skill_definitions: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          max_grade: number
          min_grade: number
          prerequisite_skills: string[] | null
          sequence_order: number | null
          skill_code: string
          skill_description: string | null
          skill_name: string
          subject_code: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_grade: number
          min_grade: number
          prerequisite_skills?: string[] | null
          sequence_order?: number | null
          skill_code: string
          skill_description?: string | null
          skill_name: string
          subject_code: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_grade?: number
          min_grade?: number
          prerequisite_skills?: string[] | null
          sequence_order?: number | null
          skill_code?: string
          skill_description?: string | null
          skill_name?: string
          subject_code?: string
        }
        Relationships: []
      }
      skins: {
        Row: {
          age_group: string
          category: string | null
          created_at: string | null
          description: string | null
          icon: string
          id: string
          is_free: boolean | null
          is_starter: boolean | null
          name: string
          preview_color: string
          price: number
          rarity: string
          skin_id: string
          sort_order: number | null
        }
        Insert: {
          age_group: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon: string
          id?: string
          is_free?: boolean | null
          is_starter?: boolean | null
          name: string
          preview_color: string
          price?: number
          rarity: string
          skin_id: string
          sort_order?: number | null
        }
        Update: {
          age_group?: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string
          id?: string
          is_free?: boolean | null
          is_starter?: boolean | null
          name?: string
          preview_color?: string
          price?: number
          rarity?: string
          skin_id?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      spaced_review_schedule: {
        Row: {
          completed: boolean | null
          created_at: string | null
          due_date: string
          id: string
          skill_code: string
          skill_name: string | null
          student_id: string | null
          subject_code: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          due_date: string
          id?: string
          skill_code: string
          skill_name?: string | null
          student_id?: string | null
          subject_code: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          due_date?: string
          id?: string
          skill_code?: string
          skill_name?: string | null
          student_id?: string | null
          subject_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "spaced_review_schedule_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "spaced_review_schedule_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      spaced_reviews: {
        Row: {
          created_at: string | null
          ease_factor: number | null
          id: string
          interval_days: number | null
          last_score: number | null
          review_count: number | null
          review_date: string
          skill_id: string
          student_id: string | null
          subject_code: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          last_score?: number | null
          review_count?: number | null
          review_date: string
          skill_id: string
          student_id?: string | null
          subject_code: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          last_score?: number | null
          review_count?: number | null
          review_date?: string
          skill_id?: string
          student_id?: string | null
          subject_code?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spaced_reviews_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "spaced_reviews_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      spelling_words: {
        Row: {
          created_at: string | null
          definition: string | null
          example_sentence: string | null
          grade_level: number | null
          id: string
          pattern: string | null
          word: string
        }
        Insert: {
          created_at?: string | null
          definition?: string | null
          example_sentence?: string | null
          grade_level?: number | null
          id?: string
          pattern?: string | null
          word: string
        }
        Update: {
          created_at?: string | null
          definition?: string | null
          example_sentence?: string | null
          grade_level?: number | null
          id?: string
          pattern?: string | null
          word?: string
        }
        Relationships: []
      }
      state_standards: {
        Row: {
          created_at: string | null
          estimated_days: number | null
          grade: string
          id: string
          sequence_order: number | null
          standard_code: string | null
          standard_description: string | null
          standard_title: string
          state_code: string
          state_name: string
          strand: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          estimated_days?: number | null
          grade: string
          id?: string
          sequence_order?: number | null
          standard_code?: string | null
          standard_description?: string | null
          standard_title: string
          state_code: string
          state_name: string
          strand?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          estimated_days?: number | null
          grade?: string
          id?: string
          sequence_order?: number | null
          standard_code?: string | null
          standard_description?: string | null
          standard_title?: string
          state_code?: string
          state_name?: string
          strand?: string | null
          subject?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          comprehension_questions: Json | null
          content: string
          created_at: string | null
          genre: string | null
          id: string
          is_favorite: boolean | null
          questions_generated_at: string | null
          reading_level: string | null
          student_id: string | null
          title: string
          word_count: number | null
        }
        Insert: {
          comprehension_questions?: Json | null
          content: string
          created_at?: string | null
          genre?: string | null
          id?: string
          is_favorite?: boolean | null
          questions_generated_at?: string | null
          reading_level?: string | null
          student_id?: string | null
          title: string
          word_count?: number | null
        }
        Update: {
          comprehension_questions?: Json | null
          content?: string
          created_at?: string | null
          genre?: string | null
          id?: string
          is_favorite?: boolean | null
          questions_generated_at?: string | null
          reading_level?: string | null
          student_id?: string | null
          title?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "stories_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_achievements: {
        Row: {
          achievement_id: string | null
          earned_at: string | null
          id: string
          student_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          student_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_achievements_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_achievements_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_ai_recommendations: {
        Row: {
          action_data: Json | null
          action_type: string | null
          created_at: string | null
          dismissed_at: string | null
          id: string
          is_active: boolean | null
          message: string
          recommendation_type: string | null
          student_id: string | null
          subject_code: string | null
        }
        Insert: {
          action_data?: Json | null
          action_type?: string | null
          created_at?: string | null
          dismissed_at?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          recommendation_type?: string | null
          student_id?: string | null
          subject_code?: string | null
        }
        Update: {
          action_data?: Json | null
          action_type?: string | null
          created_at?: string | null
          dismissed_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          recommendation_type?: string | null
          student_id?: string | null
          subject_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_ai_recommendations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_ai_recommendations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_assessments: {
        Row: {
          assessed_at: string | null
          assessment_type: string
          details: Json | null
          id: string
          level_determined: number | null
          lexile_determined: number | null
          questions_correct: number | null
          questions_total: number | null
          score: number | null
          student_id: string | null
          subject_code: string
          time_taken_seconds: number | null
        }
        Insert: {
          assessed_at?: string | null
          assessment_type: string
          details?: Json | null
          id?: string
          level_determined?: number | null
          lexile_determined?: number | null
          questions_correct?: number | null
          questions_total?: number | null
          score?: number | null
          student_id?: string | null
          subject_code: string
          time_taken_seconds?: number | null
        }
        Update: {
          assessed_at?: string | null
          assessment_type?: string
          details?: Json | null
          id?: string
          level_determined?: number | null
          lexile_determined?: number | null
          questions_correct?: number | null
          questions_total?: number | null
          score?: number | null
          student_id?: string | null
          subject_code?: string
          time_taken_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_assessments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_assessments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_continue_learning: {
        Row: {
          activity_id: string | null
          activity_title: string | null
          activity_type: string
          id: string
          last_position: Json | null
          progress_percent: number | null
          student_id: string | null
          subject_code: string
          updated_at: string | null
        }
        Insert: {
          activity_id?: string | null
          activity_title?: string | null
          activity_type: string
          id?: string
          last_position?: Json | null
          progress_percent?: number | null
          student_id?: string | null
          subject_code: string
          updated_at?: string | null
        }
        Update: {
          activity_id?: string | null
          activity_title?: string | null
          activity_type?: string
          id?: string
          last_position?: Json | null
          progress_percent?: number | null
          student_id?: string | null
          subject_code?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_continue_learning_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_continue_learning_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_daily_plan: {
        Row: {
          completed_at: string | null
          created_at: string | null
          day_number: number | null
          id: string
          notes: string | null
          plan_date: string
          schedule: Json | null
          status: string | null
          student_id: string | null
          syllabus_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          day_number?: number | null
          id?: string
          notes?: string | null
          plan_date: string
          schedule?: Json | null
          status?: string | null
          student_id?: string | null
          syllabus_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          day_number?: number | null
          id?: string
          notes?: string | null
          plan_date?: string
          schedule?: Json | null
          status?: string | null
          student_id?: string | null
          syllabus_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_daily_plan_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_daily_plan_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_daily_plan_syllabus_id_fkey"
            columns: ["syllabus_id"]
            isOneToOne: false
            referencedRelation: "student_syllabus"
            referencedColumns: ["id"]
          },
        ]
      }
      student_daily_progress: {
        Row: {
          coins_earned: number | null
          created_at: string | null
          date: string
          goal_met: boolean | null
          id: string
          minutes_learned: number | null
          student_id: string | null
          subjects_completed: string[] | null
        }
        Insert: {
          coins_earned?: number | null
          created_at?: string | null
          date?: string
          goal_met?: boolean | null
          id?: string
          minutes_learned?: number | null
          student_id?: string | null
          subjects_completed?: string[] | null
        }
        Update: {
          coins_earned?: number | null
          created_at?: string | null
          date?: string
          goal_met?: boolean | null
          id?: string
          minutes_learned?: number | null
          student_id?: string | null
          subjects_completed?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "student_daily_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_daily_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_daily_schedule: {
        Row: {
          created_at: string | null
          id: string
          schedule: Json
          schedule_date: string
          status: string | null
          student_id: string | null
          subjects_completed: number | null
          subjects_total: number | null
          total_completed_minutes: number | null
          total_planned_minutes: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          schedule: Json
          schedule_date: string
          status?: string | null
          student_id?: string | null
          subjects_completed?: number | null
          subjects_total?: number | null
          total_completed_minutes?: number | null
          total_planned_minutes?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          schedule?: Json
          schedule_date?: string
          status?: string | null
          student_id?: string | null
          subjects_completed?: number | null
          subjects_total?: number | null
          total_completed_minutes?: number | null
          total_planned_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_daily_schedule_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_daily_schedule_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_progress: {
        Row: {
          created_at: string | null
          current_level: number | null
          id: string
          last_activity: string | null
          streak_days: number | null
          student_id: string | null
          subject_id: string | null
          total_coins_earned: number | null
          total_lessons_completed: number | null
        }
        Insert: {
          created_at?: string | null
          current_level?: number | null
          id?: string
          last_activity?: string | null
          streak_days?: number | null
          student_id?: string | null
          subject_id?: string | null
          total_coins_earned?: number | null
          total_lessons_completed?: number | null
        }
        Update: {
          created_at?: string | null
          current_level?: number | null
          id?: string
          last_activity?: string | null
          streak_days?: number | null
          student_id?: string | null
          subject_id?: string | null
          total_coins_earned?: number | null
          total_lessons_completed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_purchases: {
        Row: {
          id: string
          item_id: string | null
          purchased_at: string | null
          student_id: string | null
        }
        Insert: {
          id?: string
          item_id?: string | null
          purchased_at?: string | null
          student_id?: string | null
        }
        Update: {
          id?: string
          item_id?: string | null
          purchased_at?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_purchases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_purchases_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_purchases_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_skill_progress: {
        Row: {
          attempts: number | null
          best_score: number | null
          completed: boolean | null
          created_at: string | null
          id: string
          last_practiced: string | null
          questions_answered: number | null
          questions_correct: number | null
          skill_code: string
          student_id: string | null
          subject_code: string
        }
        Insert: {
          attempts?: number | null
          best_score?: number | null
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_practiced?: string | null
          questions_answered?: number | null
          questions_correct?: number | null
          skill_code: string
          student_id?: string | null
          subject_code: string
        }
        Update: {
          attempts?: number | null
          best_score?: number | null
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_practiced?: string | null
          questions_answered?: number | null
          questions_correct?: number | null
          skill_code?: string
          student_id?: string | null
          subject_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_skill_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_skill_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_skills: {
        Row: {
          id: string
          is_locked: boolean | null
          is_mastered: boolean | null
          last_practiced: string | null
          mastered_at: string | null
          mastery_percent: number | null
          skill_code: string
          skill_name: string
          student_id: string | null
          subject_code: string
          times_correct: number | null
          times_practiced: number | null
          unlocked_at: string | null
        }
        Insert: {
          id?: string
          is_locked?: boolean | null
          is_mastered?: boolean | null
          last_practiced?: string | null
          mastered_at?: string | null
          mastery_percent?: number | null
          skill_code: string
          skill_name: string
          student_id?: string | null
          subject_code: string
          times_correct?: number | null
          times_practiced?: number | null
          unlocked_at?: string | null
        }
        Update: {
          id?: string
          is_locked?: boolean | null
          is_mastered?: boolean | null
          last_practiced?: string | null
          mastered_at?: string | null
          mastery_percent?: number | null
          skill_code?: string
          skill_name?: string
          student_id?: string | null
          subject_code?: string
          times_correct?: number | null
          times_practiced?: number | null
          unlocked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_skills_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_skills_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_skins: {
        Row: {
          equipped: boolean | null
          id: string
          purchased_at: string | null
          skin_data: Json | null
          skin_id: string | null
          student_id: string | null
        }
        Insert: {
          equipped?: boolean | null
          id?: string
          purchased_at?: string | null
          skin_data?: Json | null
          skin_id?: string | null
          student_id?: string | null
        }
        Update: {
          equipped?: boolean | null
          id?: string
          purchased_at?: string | null
          skin_data?: Json | null
          skin_id?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_skins_skin_id_fkey"
            columns: ["skin_id"]
            isOneToOne: false
            referencedRelation: "skins"
            referencedColumns: ["skin_id"]
          },
          {
            foreignKeyName: "student_skins_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_skins_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_stories_read: {
        Row: {
          completed: boolean | null
          id: string
          rating: number | null
          read_at: string | null
          story_id: string | null
          student_id: string | null
        }
        Insert: {
          completed?: boolean | null
          id?: string
          rating?: number | null
          read_at?: string | null
          story_id?: string | null
          student_id?: string | null
        }
        Update: {
          completed?: boolean | null
          id?: string
          rating?: number | null
          read_at?: string | null
          story_id?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_stories_read_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "generated_stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_stories_read_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_stories_read_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_subject_progress: {
        Row: {
          average_score: number | null
          created_at: string | null
          current_lesson: number | null
          current_level: number | null
          current_unit: number | null
          id: string
          last_activity: string | null
          lessons_completed: number | null
          mastery_percent: number | null
          quizzes_passed: number | null
          quizzes_taken: number | null
          student_id: string | null
          subject_code: string
          total_time_minutes: number | null
          updated_at: string | null
        }
        Insert: {
          average_score?: number | null
          created_at?: string | null
          current_lesson?: number | null
          current_level?: number | null
          current_unit?: number | null
          id?: string
          last_activity?: string | null
          lessons_completed?: number | null
          mastery_percent?: number | null
          quizzes_passed?: number | null
          quizzes_taken?: number | null
          student_id?: string | null
          subject_code: string
          total_time_minutes?: number | null
          updated_at?: string | null
        }
        Update: {
          average_score?: number | null
          created_at?: string | null
          current_lesson?: number | null
          current_level?: number | null
          current_unit?: number | null
          id?: string
          last_activity?: string | null
          lessons_completed?: number | null
          mastery_percent?: number | null
          quizzes_passed?: number | null
          quizzes_taken?: number | null
          student_id?: string | null
          subject_code?: string
          total_time_minutes?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_subject_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_subject_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_syllabus: {
        Row: {
          based_on_default: string | null
          based_on_school_scan: string | null
          break_duration: number | null
          created_at: string | null
          days_per_week: number | null
          end_date: string | null
          hours_per_day: number | null
          id: string
          name: string | null
          start_date: string | null
          student_id: string | null
          subject_order: string[] | null
          time_blocks: Json | null
          updated_at: string | null
        }
        Insert: {
          based_on_default?: string | null
          based_on_school_scan?: string | null
          break_duration?: number | null
          created_at?: string | null
          days_per_week?: number | null
          end_date?: string | null
          hours_per_day?: number | null
          id?: string
          name?: string | null
          start_date?: string | null
          student_id?: string | null
          subject_order?: string[] | null
          time_blocks?: Json | null
          updated_at?: string | null
        }
        Update: {
          based_on_default?: string | null
          based_on_school_scan?: string | null
          break_duration?: number | null
          created_at?: string | null
          days_per_week?: number | null
          end_date?: string | null
          hours_per_day?: number | null
          id?: string
          name?: string | null
          start_date?: string | null
          student_id?: string | null
          subject_order?: string[] | null
          time_blocks?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_syllabus_based_on_default_fkey"
            columns: ["based_on_default"]
            isOneToOne: false
            referencedRelation: "default_syllabi"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_syllabus_based_on_school_scan_fkey"
            columns: ["based_on_school_scan"]
            isOneToOne: false
            referencedRelation: "kid_scanned_docs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_syllabus_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_syllabus_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_themes: {
        Row: {
          id: string
          is_active: boolean | null
          purchased_at: string | null
          student_id: string | null
          theme_id: string | null
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          purchased_at?: string | null
          student_id?: string | null
          theme_id?: string | null
        }
        Update: {
          id?: string
          is_active?: boolean | null
          purchased_at?: string | null
          student_id?: string | null
          theme_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_themes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "kid_all_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_themes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_themes_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          age: number | null
          avatar_url: string | null
          coins: number | null
          created_at: string | null
          current_streak: number | null
          daily_goal_minutes: number | null
          grade: number | null
          grade_level: number
          id: string
          interests: string[] | null
          last_activity_date: string | null
          learning_style: string | null
          longest_streak: number | null
          name: string
          parent_id: string | null
          streak_days: number | null
          theme_id: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          coins?: number | null
          created_at?: string | null
          current_streak?: number | null
          daily_goal_minutes?: number | null
          grade?: number | null
          grade_level?: number
          id?: string
          interests?: string[] | null
          last_activity_date?: string | null
          learning_style?: string | null
          longest_streak?: number | null
          name: string
          parent_id?: string | null
          streak_days?: number | null
          theme_id?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          coins?: number | null
          created_at?: string | null
          current_streak?: number | null
          daily_goal_minutes?: number | null
          grade?: number | null
          grade_level?: number
          id?: string
          interests?: string[] | null
          last_activity_date?: string | null
          learning_style?: string | null
          longest_streak?: number | null
          name?: string
          parent_id?: string | null
          streak_days?: number | null
          theme_id?: string | null
        }
        Relationships: []
      }
      subjects: {
        Row: {
          category: string
          code: string
          color: string
          created_at: string | null
          emoji: string
          has_lexile_adaptation: boolean | null
          has_skill_levels: boolean | null
          id: string
          is_active: boolean | null
          max_grade: number | null
          min_grade: number | null
          name: string
          sequence_order: number | null
        }
        Insert: {
          category: string
          code: string
          color: string
          created_at?: string | null
          emoji: string
          has_lexile_adaptation?: boolean | null
          has_skill_levels?: boolean | null
          id?: string
          is_active?: boolean | null
          max_grade?: number | null
          min_grade?: number | null
          name: string
          sequence_order?: number | null
        }
        Update: {
          category?: string
          code?: string
          color?: string
          created_at?: string | null
          emoji?: string
          has_lexile_adaptation?: boolean | null
          has_skill_levels?: boolean | null
          id?: string
          is_active?: boolean | null
          max_grade?: number | null
          min_grade?: number | null
          name?: string
          sequence_order?: number | null
        }
        Relationships: []
      }
      syllabus_settings: {
        Row: {
          id: string
          child_id: string
          mode: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          child_id: string
          mode: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          child_id?: string
          mode?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "syllabus_settings_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          colors: Json
          created_at: string | null
          description: string | null
          id: string
          is_premium: boolean | null
          name: string
          price: number | null
        }
        Insert: {
          colors: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_premium?: boolean | null
          name: string
          price?: number | null
        }
        Update: {
          colors?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_premium?: boolean | null
          name?: string
          price?: number | null
        }
        Relationships: []
      }
      weekly_test_questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          difficulty: string | null
          explanation: string | null
          grade_level: number
          id: string
          options: Json | null
          question_text: string
          question_type: string
          rule_id: string | null
          subject: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          difficulty?: string | null
          explanation?: string | null
          grade_level: number
          id?: string
          options?: Json | null
          question_text: string
          question_type: string
          rule_id?: string | null
          subject: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          difficulty?: string | null
          explanation?: string | null
          grade_level?: number
          id?: string
          options?: Json | null
          question_text?: string
          question_type?: string
          rule_id?: string | null
          subject?: string
        }
        Relationships: []
      }
      word_pronunciations: {
        Row: {
          audio_url: string | null
          created_at: string | null
          grade_level: number | null
          id: string
          phonetic: string | null
          subject: string | null
          syllables: string[] | null
          word: string
          word_type: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          grade_level?: number | null
          id?: string
          phonetic?: string | null
          subject?: string | null
          syllables?: string[] | null
          word: string
          word_type?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          grade_level?: number | null
          id?: string
          phonetic?: string | null
          subject?: string | null
          syllables?: string[] | null
          word?: string
          word_type?: string | null
        }
        Relationships: []
      }
      writing_prompts: {
        Row: {
          created_at: string | null
          grade_level: number | null
          hints: Json | null
          id: string
          prompt: string
          prompt_type: string | null
          rubric: Json | null
          title: string
          word_goal: number | null
        }
        Insert: {
          created_at?: string | null
          grade_level?: number | null
          hints?: Json | null
          id?: string
          prompt: string
          prompt_type?: string | null
          rubric?: Json | null
          title: string
          word_goal?: number | null
        }
        Update: {
          created_at?: string | null
          grade_level?: number | null
          hints?: Json | null
          id?: string
          prompt?: string
          prompt_type?: string | null
          rubric?: Json | null
          title?: string
          word_goal?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      kid_all_data: {
        Row: {
          assessments: number | null
          chat_messages: number | null
          lessons_completed: number | null
          parent_id: string | null
          quiz_answers: number | null
          stories_read: number | null
          student_id: string | null
          student_name: string | null
        }
        Insert: {
          assessments?: never
          chat_messages?: never
          lessons_completed?: never
          parent_id?: string | null
          quiz_answers?: never
          stories_read?: never
          student_id?: string | null
          student_name?: string | null
        }
        Update: {
          assessments?: never
          chat_messages?: never
          lessons_completed?: never
          parent_id?: string | null
          quiz_answers?: never
          stories_read?: never
          student_id?: string | null
          student_name?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_coins:
        | {
            Args: { p_amount: number; p_child_id: string; p_reason?: string }
            Returns: number
          }
        | { Args: { p_amount: number; p_student_id: string }; Returns: number }
      append_log_message: {
        Args: { p_batch_name: string; p_message: string }
        Returns: undefined
      }
      check_due_reviews: {
        Args: { p_limit?: number; p_student_id: string }
        Returns: Json
      }
      delete_all_kid_data: { Args: { kid_id: string }; Returns: string }
      get_generation_summary: {
        Args: never
        Returns: {
          failed: number
          generated: number
          pending: number
          subject_code: string
          total_skills: number
        }[]
      }
      get_next_skill: {
        Args: { p_student_id: string; p_subject_code: string }
        Returns: Json
      }
      mark_skill_complete: {
        Args: {
          p_coins_earned?: number
          p_score?: number
          p_skill_id: string
          p_student_id: string
          p_subject_code: string
        }
        Returns: Json
      }
      save_lesson_progress: {
        Args: {
          p_completed?: boolean
          p_score?: number
          p_skill_id: string
          p_student_id: string
          p_subject_code: string
          p_time_spent?: number
        }
        Returns: Json
      }
      schedule_spaced_review: {
        Args: {
          p_score: number
          p_skill_id: string
          p_student_id: string
          p_subject_code: string
        }
        Returns: Json
      }
      update_streak: { Args: { p_student_id: string }; Returns: Json }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

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
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// Type exports for backwards compatibility with existing code
export type Child = Database['public']['Tables']['children']['Row']
export type Story = Database['public']['Tables']['stories']['Row']
export type Achievement = Database['public']['Tables']['achievements']['Row']
export type StudentAchievement = Database['public']['Tables']['student_achievements']['Row']
export type LessonContent = Database['public']['Tables']['lesson_content']['Row']
export type CurriculumSubject = Database['public']['Tables']['curriculum_subjects']['Row']
export type CurriculumSkill = Database['public']['Tables']['curriculum_skills']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Theme = Database['public']['Tables']['themes']['Row']

// Note: These tables don't exist in the current database schema
// If you need them, you may need to create them or use alternative tables:
// - story_questions (doesn't exist - questions may be embedded in stories)
// - reading_progress (doesn't exist - use student_progress or student_stories_read)
// - story_attempts (doesn't exist - use student_stories_read)
// - owned_themes (doesn't exist - use student_themes)
// - disabled_themes (doesn't exist)
// - lesson_progress (doesn't exist - use student_skill_progress or lesson_packages)
// - answer_attempts (doesn't exist)
// - themes_catalog (doesn't exist - use themes table)
// - learning_profiles (doesn't exist)

// Type aliases for tables that might be using different names
export type OwnedTheme = Database['public']['Tables']['student_themes']['Row']
export type DisabledTheme = never // This table doesn't exist in schema
export type StoryQuestion = never // Story questions don't have a separate table
export type ReadingProgress = Database['public']['Tables']['student_stories_read']['Row']
export type LessonProgress = Database['public']['Tables']['student_skill_progress']['Row']
// Answer attempts table - tracks every answer for adaptive learning
export interface AnswerAttempt {
  id: string;
  child_id: string;
  skill_id: string;
  question_text: string;
  answer_given: string;
  is_correct: boolean;
  time_spent_seconds: number;
  help_requested: boolean;
  tutor_intervened: boolean;
  created_at: string;
}

// Learning profiles table - AI-powered personalization
export interface LearningProfile {
  id: string;
  child_id: string;
  primary_learning_style: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  secondary_learning_style?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  preferred_pace: 'slow' | 'medium' | 'fast';
  frustration_threshold: number;
  needs_more_examples: boolean;
  responds_to_encouragement: boolean;
  responds_to_challenges: boolean;
  strongest_subjects: string[];
  weakest_subjects: string[];
  favorite_subjects: string[];
  preferred_example_types: string[];
  best_time_of_day?: 'morning' | 'afternoon' | 'evening';
  average_session_length: number;
  confidence_level: 'low' | 'medium' | 'high';
  total_questions_answered: number;
  total_questions_correct: number;
  overall_accuracy: number;
  learning_style_confidence: number;
  created_at: string;
  updated_at: string;
}
