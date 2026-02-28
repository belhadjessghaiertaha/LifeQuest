'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Zap, Trophy } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ProfileStats {
  name: string;
  level: number;
  xp: number;
  streak: number;
  total_xp_for_level: number;
}

interface WeeklyStats {
  tasks: number;
  habits: number;
  events: number;
  notes: number;
  achievements: number;
}

export default function OverviewModule() {
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    tasks: 0,
    habits: 0,
    events: 0,
    notes: 0,
    achievements: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name, level, xp, streak')
          .eq('email', 'Belhadjessghaiertaha@gmail.com')
          .maybeSingle();

        if (profileData) {
          const totalXpForLevel = 100 * (profileData.level + 1);
          setStats({
            ...profileData,
            total_xp_for_level: totalXpForLevel,
          });
        }

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0];

        const { count: tasksCount } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_email', 'Belhadjessghaiertaha@gmail.com')
          .eq('status', 'completed')
          .gte('created_at', oneWeekAgoStr);

        const { count: habitsCount } = await supabase
          .from('habit_logs')
          .select('*', { count: 'exact', head: true })
          .eq('user_email', 'Belhadjessghaiertaha@gmail.com')
          .gte('logged_date', oneWeekAgoStr);

        const { count: eventsCount } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('user_email', 'Belhadjessghaiertaha@gmail.com')
          .gte('created_at', oneWeekAgoStr);

        const { count: notesCount } = await supabase
          .from('notes')
          .select('*', { count: 'exact', head: true })
          .eq('user_email', 'Belhadjessghaiertaha@gmail.com')
          .gte('created_at', oneWeekAgoStr);

        const { count: achievementsCount } = await supabase
          .from('achievements')
          .select('*', { count: 'exact', head: true })
          .eq('user_email', 'Belhadjessghaiertaha@gmail.com');

        setWeeklyStats({
          tasks: tasksCount || 0,
          habits: habitsCount || 0,
          events: eventsCount || 0,
          notes: notesCount || 0,
          achievements: achievementsCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  const xpProgress = (stats.xp / stats.total_xp_for_level) * 100;

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back, {stats.name}!</CardTitle>
          <CardDescription>
            Keep up with your quests and level up your life
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              Level Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-3xl font-bold text-primary">{stats.level}</div>
              <p className="text-xs text-muted-foreground">Current Level</p>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">XP</span>
                <span className="font-medium">{stats.xp} / {stats.total_xp_for_level}</span>
              </div>
              <Progress value={xpProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              Daily Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div className="text-3xl font-bold text-orange-500">{stats.streak}</div>
              <p className="text-xs text-muted-foreground">Days in a row</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div className="text-3xl font-bold text-yellow-500">{weeklyStats.achievements}</div>
              <p className="text-xs text-muted-foreground">Unlocked badges</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">This Week</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{weeklyStats.tasks}</div>
            <p className="text-xs text-muted-foreground">Tasks Done</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{weeklyStats.habits}</div>
            <p className="text-xs text-muted-foreground">Habits</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{weeklyStats.events}</div>
            <p className="text-xs text-muted-foreground">Events</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-500">{weeklyStats.notes}</div>
            <p className="text-xs text-muted-foreground">Notes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
