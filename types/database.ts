export interface Child {
  id: string
  parent_id: string
  name: string
  grade_level: string
  coins: number
  current_theme: string
  avatar_url: string | null
  created_at: string
  updated_at: string
  pin_required: boolean
  pin_code: string | null
  selected_theme_skin: string
  theme_xp: number
  theme_level: number
  xp: number
  level: number
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
}

export interface DisabledTheme {
  id: string
  child_id: string
  theme_id: string
  disabled_by: string
  disabled_at: string
}

export interface OwnedTheme {
  id: string
  child_id: string
  theme_id: string
  purchased_at: string
  is_free: boolean
  unlocked_at?: string
}

export type OwnedThemeInsert = {
  child_id: string
  theme_id: string
  is_free: boolean
  unlocked_at?: string
}

export type OwnedThemeUpdate = {
  child_id?: string
  theme_id?: string
  purchased_at?: string
  is_free?: boolean
  unlocked_at?: string
}

export interface LessonContent {
  id: string
  skill_id: string
  subject_code: string
  skill_name: string
  rules_text: string | null
  rules_audio_script: string | null
  demo_problems: any
  guided_practice: any
  independent_practice: any
  challenge_problems: any
  quiz_questions: any
  review_questions: any
  generated_at: string
}

export interface Lesson {
  id: string
  subject_id: string
  title: string
  grade_level: number
  difficulty: 'easy' | 'medium' | 'hard'
  coin_reward: number
  content: any
  created_at: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  requirement_type: string
  requirement_value: number
  coin_reward: number
}

export interface StudentAchievement {
  id: string
  student_id: string
  achievement_id: string
  unlocked_at: string | null
}

export interface Story {
  id: string
  lexile_band: string
  grade_level: number
  genre: string
  gender_target: string
  title: string
  content: string
  word_count: number
  expected_time_minutes: number
  coins_reward: number
  bonus_coins: number
  is_active: boolean
  created_at: string
}

export interface StoryQuestion {
  id: string
  story_id: string
  question_number: number
  question_text: string
  choice_a: string
  choice_b: string
  choice_c: string
  choice_d: string
  correct_answer: 'A' | 'B' | 'C' | 'D'
  created_at: string
}

export interface StoryAttempt {
  id: string
  child_id: string
  story_id: string
  started_at: string
  completed_at: string | null
  reading_time_seconds: number | null
  score: number | null
  result: string | null
  coins_earned: number
  answers: Record<string, string> | null
  created_at: string
}

export interface ReadingProgress {
  id: string
  child_id: string
  current_lexile_band: string
  stories_completed: number
  total_questions_correct: number
  total_questions_answered: number
  average_score: number
  last_story_id: string | null
  created_at: string
  updated_at: string
}

export interface CurriculumSubject {
  id: string
  name: string
  code: string
  grade_level: number | null
  description: string | null
  icon: string | null
  color: string | null
  created_at: string
  grade_levels: number[]
  is_active: boolean
  display_order: number
}

export interface CurriculumSkill {
  id: string
  lesson_id: string | null
  subject_code: string
  skill_name: string
  difficulty_level: number
  grade_level: number
  question_template: string | null
  answer_template: string | null
  created_at: string
  skill_code: string | null
  description: string | null
  display_order: number
  is_active: boolean
}

export interface LessonProgress {
  id: string
  child_id: string
  subject_code: string
  skill_id: string | null
  skill_name: string
  completed: boolean
  score: number | null
  stars: number
  attempts: number
  time_spent_seconds: number
  completed_at: string | null
  last_attempt_at: string
}

export interface AnswerAttempt {
  id: string
  child_id: string
  skill_id: string
  question_text: string
  answer_given: string
  is_correct: boolean
  time_spent_seconds: number
  help_requested: boolean
  tutor_intervened: boolean
  created_at: string
}

export interface ThemesCatalog {
  id: string
  name: string
  age_group: string
  category: string
  price_tier: string
  coin_cost: number
  preview_image: string | null
  tutor_name: string
  tutor_personality: string | null
  is_active: boolean
  boy_vibe: boolean
  girl_vibe: boolean
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export interface LearningProfile {
  id: string
  child_id: string
  primary_learning_style: 'visual' | 'auditory' | 'reading' | 'kinesthetic'
  secondary_learning_style: 'visual' | 'auditory' | 'reading' | 'kinesthetic' | null
  preferred_pace: 'slow' | 'medium' | 'fast'
  frustration_threshold: number
  needs_more_examples: boolean
  responds_to_encouragement: boolean
  responds_to_challenges: boolean
  strongest_subjects: string[]
  weakest_subjects: string[]
  favorite_subjects: string[]
  preferred_example_types: string[]
  best_time_of_day: 'morning' | 'afternoon' | 'evening' | null
  average_session_length: number
  confidence_level: 'low' | 'medium' | 'high'
  total_questions_answered: number
  total_questions_correct: number
  overall_accuracy: number
  learning_style_confidence: number
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      children: {
        Row: Child
        Insert: Omit<Child, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Child, 'id' | 'created_at'>>
      }
      owned_themes: {
        Row: OwnedTheme
        Insert: OwnedThemeInsert
        Update: OwnedThemeUpdate
      }
      disabled_themes: {
        Row: DisabledTheme
        Insert: Omit<DisabledTheme, 'id' | 'disabled_at'>
        Update: Partial<Omit<DisabledTheme, 'id'>>
      }
      lesson_content: {
        Row: LessonContent
        Insert: Omit<LessonContent, 'id' | 'generated_at'>
        Update: Partial<Omit<LessonContent, 'id'>>
      }
      stories: {
        Row: Story
        Insert: Omit<Story, 'id' | 'created_at'>
        Update: Partial<Omit<Story, 'id'>>
      }
      story_attempts: {
        Row: StoryAttempt
        Insert: Omit<StoryAttempt, 'id' | 'created_at'>
        Update: Partial<Omit<StoryAttempt, 'id'>>
      }
      reading_progress: {
        Row: ReadingProgress
        Insert: Omit<ReadingProgress, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ReadingProgress, 'id' | 'created_at'>>
      }
      curriculum_subjects: {
        Row: CurriculumSubject
        Insert: Omit<CurriculumSubject, 'id' | 'created_at'>
        Update: Partial<Omit<CurriculumSubject, 'id'>>
      }
      curriculum_skills: {
        Row: CurriculumSkill
        Insert: Omit<CurriculumSkill, 'id' | 'created_at'>
        Update: Partial<Omit<CurriculumSkill, 'id'>>
      }
      lesson_progress: {
        Row: LessonProgress
        Insert: Omit<LessonProgress, 'id' | 'last_attempt_at'>
        Update: Partial<Omit<LessonProgress, 'id'>>
      }
      answer_attempts: {
        Row: AnswerAttempt
        Insert: Omit<AnswerAttempt, 'id' | 'created_at'>
        Update: Partial<Omit<AnswerAttempt, 'id'>>
      }
      themes_catalog: {
        Row: ThemesCatalog
        Insert: Omit<ThemesCatalog, 'created_at'>
        Update: Partial<ThemesCatalog>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      learning_profiles: {
        Row: LearningProfile
        Insert: Omit<LearningProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<LearningProfile, 'id' | 'created_at'>>
      }
    }
  }
}
