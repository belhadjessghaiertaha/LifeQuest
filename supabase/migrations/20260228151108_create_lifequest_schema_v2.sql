/*
  # LifeQuest Database Schema v2
  
  1. New Tables
    - `profiles` - User profile with gamification
    - `events` - Calendar events
    - `tasks` - Task manager tasks
    - `todos` - Simple to-do list
    - `notes` - Personal notes
    - `habits` - Habit tracking
    - `habit_logs` - Habit completion logs
    - `transactions` - Money management
    - `achievements` - Gamification achievements
  
  2. Security
    - Enable RLS on all tables
    - Add policies for single authenticated user access
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  level integer DEFAULT 1,
  xp integer DEFAULT 0,
  streak integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  date text NOT NULL,
  user_email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  priority text DEFAULT 'medium',
  status text DEFAULT 'todo',
  due_date text,
  user_email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_completed boolean DEFAULT false,
  user_email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text DEFAULT '',
  reminder_date text,
  user_email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  frequency text DEFAULT 'daily',
  color text DEFAULT 'blue',
  user_email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create habit_logs table
CREATE TABLE IF NOT EXISTS habit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES habits(id) ON DELETE CASCADE,
  logged_date text NOT NULL,
  user_email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  description text NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL,
  category text DEFAULT 'general',
  date text NOT NULL,
  user_email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  earned_date text,
  user_email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (id, user_email)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (email = 'Belhadjessghaiertaha@gmail.com')
  WITH CHECK (email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (email = 'Belhadjessghaiertaha@gmail.com');

-- Events policies  
CREATE POLICY "Users can view own events"
  ON events FOR SELECT
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can insert own events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can update own events"
  ON events FOR UPDATE
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com')
  WITH CHECK (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can delete own events"
  ON events FOR DELETE
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com');

-- Tasks policies
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com')
  WITH CHECK (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com');

-- Todos policies
CREATE POLICY "Users can view own todos"
  ON todos FOR SELECT
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can insert own todos"
  ON todos FOR INSERT
  TO authenticated
  WITH CHECK (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can update own todos"
  ON todos FOR UPDATE
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com')
  WITH CHECK (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can delete own todos"
  ON todos FOR DELETE
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com');

-- Notes policies
CREATE POLICY "Users can view own notes"
  ON notes FOR SELECT
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can insert own notes"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can update own notes"
  ON notes FOR UPDATE
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com')
  WITH CHECK (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can delete own notes"
  ON notes FOR DELETE
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com');

-- Habits policies
CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can insert own habits"
  ON habits FOR INSERT
  TO authenticated
  WITH CHECK (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com')
  WITH CHECK (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com');

-- Habit logs policies
CREATE POLICY "Users can view own habit logs"
  ON habit_logs FOR SELECT
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can insert own habit logs"
  ON habit_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can delete own habit logs"
  ON habit_logs FOR DELETE
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com');

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com')
  WITH CHECK (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com');

-- Achievements policies
CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (user_email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Users can update own achievements"
  ON achievements FOR UPDATE
  TO authenticated
  USING (user_email = 'Belhadjessghaiertaha@gmail.com')
  WITH CHECK (user_email = 'Belhadjessghaiertaha@gmail.com');
