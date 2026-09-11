import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface GeneratedEmail {
  id: string;
  topic: string;
  audience: string;
  tone: string;
  key_points: string;
  content: string;
  created_at: string;
}

export interface MeetingSummary {
  id: string;
  title: string;
  raw_notes: string;
  summary: string;
  key_points: string;
  decisions: string;
  action_items: string;
  created_at: string;
}

export interface TaskPlan {
  id: string;
  plan_type: string;
  input_tasks: string;
  structured_plan: string;
  created_at: string;
}

export interface ResearchSummary {
  id: string;
  topic: string;
  source_text: string;
  summary: string;
  key_insights: string;
  recommendations: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: string;
  content: string;
  created_at: string;
}
