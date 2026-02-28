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

export default function OverviewModule() {
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('name, level, xp, streak')
          .eq('email', 'Belhadjessghaiertaha@gmail.com')
          .single();

        if (data) {
          // Calculate XP needed for next level (e.g., 100 * level)
          const totalXpForLevel = 100 * (data.level + 1);
          setStats({
            ...data,
            total_xp_for_level: totalXpForLevel,
          });
        }
      } catch (error) {
        console.error('Error fetching profile stats:', error);
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
      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back, {stats.name}!</CardTitle>
          <CardDescription>
            Keep up with your quests and level up your life
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Level & XP */}
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

        {/* Streak */}
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

        {/* Achievements */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div className="text-3xl font-bold text-yellow-500">0</div>
              <p className="text-xs text-muted-foreground">Unlocked badges</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">This Week</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">0</div>
            <p className="text-xs text-muted-foreground">Tasks Done</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">0</div>
            <p className="text-xs text-muted-foreground">Habits</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">0</div>
            <p className="text-xs text-muted-foreground">Events</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">0</div>
            <p className="text-xs text-muted-foreground">Notes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
