-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  currency TEXT DEFAULT 'TND',
  xp_points INT DEFAULT 0,
  level INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  category TEXT,
  color TEXT DEFAULT '#3B82F6',
  is_all_day BOOLEAN DEFAULT false,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'todo',
  due_date DATE,
  category TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Todos table
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  color TEXT DEFAULT '#FBBF24',
  is_pinned BOOLEAN DEFAULT false,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  reminder_date TIMESTAMP WITH TIME ZONE NOT NULL,
  reminder_type TEXT DEFAULT 'once',
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habits table
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT DEFAULT 'daily',
  target_count INT DEFAULT 1,
  category TEXT,
  color TEXT DEFAULT '#10B981',
  streak INT DEFAULT 0,
  best_streak INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habit logs table
CREATE TABLE IF NOT EXISTS habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  count INT DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(habit_id, log_date)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(15, 2) NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  transaction_date DATE NOT NULL,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  badge_type TEXT,
  unlock_criteria TEXT,
  unlock_date TIMESTAMP WITH TIME ZONE,
  is_unlocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_task_id ON todos(task_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id ON habit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for single user (Taha Belhadj Essghaier)
-- Note: Since this is a personal app, we'll allow authenticated user access
-- In production, you'd restrict to a specific user_id

CREATE POLICY "Allow users to view own profile"
  ON profiles FOR SELECT
  USING (email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Allow users to update own profile"
  ON profiles FOR UPDATE
  USING (email = 'Belhadjessghaiertaha@gmail.com');

CREATE POLICY "Allow users to view own events"
  ON events FOR SELECT
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to insert own events"
  ON events FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to update own events"
  ON events FOR UPDATE
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to delete own events"
  ON events FOR DELETE
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

-- Apply similar policies to other tables
CREATE POLICY "Allow users to view own tasks"
  ON tasks FOR SELECT
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to insert own tasks"
  ON tasks FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to update own tasks"
  ON tasks FOR UPDATE
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to delete own tasks"
  ON tasks FOR DELETE
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to view own todos"
  ON todos FOR SELECT
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to insert own todos"
  ON todos FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to update own todos"
  ON todos FOR UPDATE
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to delete own todos"
  ON todos FOR DELETE
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to view own notes"
  ON notes FOR SELECT
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to insert own notes"
  ON notes FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to update own notes"
  ON notes FOR UPDATE
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to delete own notes"
  ON notes FOR DELETE
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to view own reminders"
  ON reminders FOR SELECT
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to insert own reminders"
  ON reminders FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to update own reminders"
  ON reminders FOR UPDATE
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to delete own reminders"
  ON reminders FOR DELETE
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to view own habits"
  ON habits FOR SELECT
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to insert own habits"
  ON habits FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to update own habits"
  ON habits FOR UPDATE
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to delete own habits"
  ON habits FOR DELETE
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to view own habit logs"
  ON habit_logs FOR SELECT
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to insert own habit logs"
  ON habit_logs FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to update own habit logs"
  ON habit_logs FOR UPDATE
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to delete own habit logs"
  ON habit_logs FOR DELETE
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to view own transactions"
  ON transactions FOR SELECT
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to update own transactions"
  ON transactions FOR UPDATE
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to delete own transactions"
  ON transactions FOR DELETE
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to view own achievements"
  ON achievements FOR SELECT
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to insert own achievements"
  ON achievements FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));

CREATE POLICY "Allow users to update own achievements"
  ON achievements FOR UPDATE
  USING (user_id IN (SELECT id FROM profiles WHERE email = 'Belhadjessghaiertaha@gmail.com'));
