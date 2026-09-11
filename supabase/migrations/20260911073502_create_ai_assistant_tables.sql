/*
# AI Workplace Productivity Assistant - Database Schema

1. New Tables
- `generated_emails` — Stores emails created by the Smart Email Generator
  - `id` (uuid, primary key)
  - `topic` (text, the email subject/context)
  - `audience` (text, who the email is for: client, manager, team)
  - `tone` (text, tone variation: formal, informal, persuasive)
  - `key_points` (text, bullet points to include)
  - `content` (text, the generated email body)
  - `created_at` (timestamp)

- `meeting_summaries` — Stores summaries created by the Meeting Notes Summarizer
  - `id` (uuid, primary key)
  - `title` (text, meeting title)
  - `raw_notes` (text, original meeting notes)
  - `summary` (text, concise summary)
  - `key_points` (text, extracted key points as JSON array)
  - `decisions` (text, extracted decisions as JSON array)
  - `action_items` (text, extracted action items as JSON array)
  - `created_at` (timestamp)

- `task_plans` — Stores plans created by the AI Task Planner
  - `id` (uuid, primary key)
  - `plan_type` (text, daily or weekly)
  - `input_tasks` (text, raw task list)
  - `structured_plan` (text, the generated plan as JSON)
  - `created_at` (timestamp)

- `research_summaries` — Stores summaries from the AI Research Assistant
  - `id` (uuid, primary key)
  - `topic` (text, the research topic)
  - `source_text` (text, the article/report text)
  - `summary` (text, concise summary)
  - `key_insights` (text, key insights as JSON array)
  - `recommendations` (text, recommendations as JSON array)
  - `created_at` (timestamp)

- `chat_history` — Stores conversation history from the AI Chatbot
  - `id` (uuid, primary key)
  - `session_id` (text, groups messages in a conversation)
  - `role` (text, user or assistant)
  - `content` (text, message content)
  - `created_at` (timestamp)

2. Security
- Enable RLS on all tables.
- Allow anon + authenticated CRUD since this is a single-tenant app with no sign-in.
- All data is intentionally shared/public within the app.
*/

CREATE TABLE IF NOT EXISTS generated_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  audience text NOT NULL,
  tone text NOT NULL,
  key_points text,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE generated_emails ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_emails" ON generated_emails;
CREATE POLICY "anon_select_emails" ON generated_emails FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_emails" ON generated_emails;
CREATE POLICY "anon_insert_emails" ON generated_emails FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_emails" ON generated_emails;
CREATE POLICY "anon_update_emails" ON generated_emails FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_emails" ON generated_emails;
CREATE POLICY "anon_delete_emails" ON generated_emails FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS meeting_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  raw_notes text NOT NULL,
  summary text NOT NULL,
  key_points text,
  decisions text,
  action_items text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meeting_summaries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_meetings" ON meeting_summaries;
CREATE POLICY "anon_select_meetings" ON meeting_summaries FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_meetings" ON meeting_summaries;
CREATE POLICY "anon_insert_meetings" ON meeting_summaries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_meetings" ON meeting_summaries;
CREATE POLICY "anon_update_meetings" ON meeting_summaries FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_meetings" ON meeting_summaries;
CREATE POLICY "anon_delete_meetings" ON meeting_summaries FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS task_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type text NOT NULL,
  input_tasks text NOT NULL,
  structured_plan text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE task_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_plans" ON task_plans;
CREATE POLICY "anon_select_plans" ON task_plans FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_plans" ON task_plans;
CREATE POLICY "anon_insert_plans" ON task_plans FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_plans" ON task_plans;
CREATE POLICY "anon_update_plans" ON task_plans FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_plans" ON task_plans;
CREATE POLICY "anon_delete_plans" ON task_plans FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS research_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  source_text text NOT NULL,
  summary text NOT NULL,
  key_insights text,
  recommendations text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE research_summaries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_research" ON research_summaries;
CREATE POLICY "anon_select_research" ON research_summaries FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_research" ON research_summaries;
CREATE POLICY "anon_insert_research" ON research_summaries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_research" ON research_summaries;
CREATE POLICY "anon_update_research" ON research_summaries FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_research" ON research_summaries;
CREATE POLICY "anon_delete_research" ON research_summaries FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_chat" ON chat_history;
CREATE POLICY "anon_select_chat" ON chat_history FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_chat" ON chat_history;
CREATE POLICY "anon_insert_chat" ON chat_history FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_chat" ON chat_history;
CREATE POLICY "anon_update_chat" ON chat_history FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_chat" ON chat_history;
CREATE POLICY "anon_delete_chat" ON chat_history FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_emails_created ON generated_emails(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_created ON meeting_summaries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_plans_created ON task_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_research_created ON research_summaries(created_at DESC);
