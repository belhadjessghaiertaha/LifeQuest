'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@supabase/supabase-js';
import { Zap, Plus, Trash2, Check, Flame } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  color: string;
  created_at: string;
}

interface HabitLog {
  id: string;
  habit_id: string;
  logged_date: string;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [color, setColor] = useState('blue');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const { data: habitsData } = await supabase
        .from('habits')
        .select('*')
        .eq('user_email', 'Belhadjessghaiertaha@gmail.com');

      const { data: logsData } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_email', 'Belhadjessghaiertaha@gmail.com');

      setHabits(habitsData || []);
      setHabitLogs(logsData || []);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName) return;

    setIsAdding(true);
    try {
      const { data } = await supabase
        .from('habits')
        .insert({
          name: habitName,
          frequency,
          color,
          user_email: 'Belhadjessghaiertaha@gmail.com',
        })
        .select();

      if (data) {
        setHabits([...habits, ...data]);
        setHabitName('');
        setFrequency('daily');
        setColor('blue');
      }
    } catch (error) {
      console.error('Error adding habit:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const toggleHabitLog = async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existingLog = habitLogs.find(
      (log) => log.habit_id === habitId && log.logged_date === today
    );

    try {
      if (existingLog) {
        await supabase.from('habit_logs').delete().eq('id', existingLog.id);
        setHabitLogs(habitLogs.filter((log) => log.id !== existingLog.id));
      } else {
        const { data } = await supabase
          .from('habit_logs')
          .insert({
            habit_id: habitId,
            logged_date: today,
            user_email: 'Belhadjessghaiertaha@gmail.com',
          })
          .select();

        if (data) {
          setHabitLogs([...habitLogs, ...data]);
        }
      }
    } catch (error) {
      console.error('Error logging habit:', error);
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      await supabase.from('habits').delete().eq('id', id);
      setHabits(habits.filter((h) => h.id !== id));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const getHabitStreak = (habitId: string) => {
    const today = new Date();
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const hasLog = habitLogs.some(
        (log) => log.habit_id === habitId && log.logged_date === dateStr
      );

      if (hasLog) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const getHabitCompletion = (habitId: string) => {
    const today = new Date();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());

    let completed = 0;
    const daysInWeek = 7;

    for (let i = 0; i < daysInWeek; i++) {
      const date = new Date(thisWeekStart);
      date.setDate(thisWeekStart.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      if (habitLogs.some((log) => log.habit_id === habitId && log.logged_date === dateStr)) {
        completed++;
      }
    }

    return Math.round((completed / daysInWeek) * 100);
  };

  const colorClass: Record<string, string> = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-8 h-8 text-primary" />
            Habit Tracker
          </h1>
          <p className="text-muted-foreground mt-1">Build and track your daily habits</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Habit Card */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg">New Habit</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddHabit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Habit Name *</label>
                  <Input
                    placeholder="e.g., Exercise, Read, Meditate"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as Habit['frequency'])}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color</label>
                  <div className="grid grid-cols-6 gap-2">
                    {Object.keys(colorClass).map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setColor(col)}
                        className={`h-8 rounded-md ${colorClass[col as keyof typeof colorClass]} transition ${
                          color === col ? 'ring-2 ring-offset-2 ring-primary' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isAdding || !habitName}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Habit
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Habits List */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : habits.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No habits yet. Start building one!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {habits.map((habit) => {
                  const streak = getHabitStreak(habit.id);
                  const completion = getHabitCompletion(habit.id);
                  const today = new Date().toISOString().split('T')[0];
                  const isCompleteToday = habitLogs.some(
                    (log) => log.habit_id === habit.id && log.logged_date === today
                  );

                  return (
                    <Card key={habit.id} className="hover:border-primary/50 transition">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${colorClass[habit.color as keyof typeof colorClass]}`}
                              />
                              <CardTitle className="text-base">{habit.name}</CardTitle>
                              <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                {habit.frequency}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteHabit(habit.id)}
                            className="text-destructive hover:bg-destructive/10 flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-medium">{streak} day streak</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => toggleHabitLog(habit.id)}
                            className={`gap-2 ${
                              isCompleteToday
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-foreground hover:bg-secondary/80'
                            }`}
                          >
                            {isCompleteToday && <Check className="w-4 h-4" />}
                            {isCompleteToday ? 'Done!' : 'Log Today'}
                          </Button>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">This week</span>
                            <span className="font-medium">{completion}%</span>
                          </div>
                          <Progress value={completion} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
