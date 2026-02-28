'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@supabase/supabase-js';
import { Trophy } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_date?: string;
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Sign in to LifeQuest for the first time',
    icon: '👣',
  },
  {
    id: 'task-master',
    name: 'Task Master',
    description: 'Complete 10 tasks',
    icon: '✅',
  },
  {
    id: 'habit-builder',
    name: 'Habit Builder',
    description: 'Maintain a 7-day streak on a habit',
    icon: '🔥',
  },
  {
    id: 'note-keeper',
    name: 'Note Keeper',
    description: 'Create 20 notes',
    icon: '📝',
  },
  {
    id: 'time-keeper',
    name: 'Time Keeper',
    description: 'Create 5 calendar events',
    icon: '📅',
  },
  {
    id: 'money-wise',
    name: 'Money Wise',
    description: 'Track 50 transactions',
    icon: '💰',
  },
  {
    id: 'level-10',
    name: 'Level 10',
    description: 'Reach level 10',
    icon: '⚡',
  },
  {
    id: 'achiever',
    name: 'Achiever',
    description: 'Unlock 5 achievements',
    icon: '🏆',
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Unlock all achievements',
    icon: '👑',
  },
];

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({ level: 1, tasks_completed: 0 });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_email', 'Belhadjessghaiertaha@gmail.com');

      const { data: profileData } = await supabase
        .from('profiles')
        .select('level')
        .eq('email', 'Belhadjessghaiertaha@gmail.com')
        .single();

      const { count: tasksCompleted } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_email', 'Belhadjessghaiertaha@gmail.com')
        .eq('status', 'completed');

      setAchievements(achievementsData || []);
      setUserStats({
        level: profileData?.level || 1,
        tasks_completed: tasksCompleted || 0,
      });
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAchievementEarned = (achievementId: string) => {
    return achievements.some((a) => a.id === achievementId);
  };

  const earnedCount = achievements.length;
  const totalCount = ALL_ACHIEVEMENTS.length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary" />
            Achievements
          </h1>
          <p className="text-muted-foreground mt-1">Unlock badges and unlock your potential</p>
        </div>

        {/* Progress Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Your Progress
              <span className="text-2xl">{earnedCount}/{totalCount}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Achievements Unlocked</span>
                  <span className="text-sm font-bold">{Math.round((earnedCount / totalCount) * 100)}%</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(earnedCount / totalCount) * 100}%` }}
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Loading your stats...</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-primary/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userStats.level}</div>
                    <p className="text-xs text-muted-foreground">Current Level</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{userStats.tasks_completed}</div>
                    <p className="text-xs text-muted-foreground">Tasks Done</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">{earnedCount}</div>
                    <p className="text-xs text-muted-foreground">Badges</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Achievements Grid */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">All Achievements</h2>
            <p className="text-sm text-muted-foreground">Complete challenges to unlock badges</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_ACHIEVEMENTS.map((achievement) => {
                const earned = isAchievementEarned(achievement.id);
                const earnedData = achievements.find((a) => a.id === achievement.id);

                return (
                  <Card
                    key={achievement.id}
                    className={`transition ${
                      earned
                        ? 'border-primary/50 bg-primary/5'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-4xl">{achievement.icon}</div>
                        {earned && (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
                            <span className="text-xs font-bold">✓</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      <CardTitle className="text-base">{achievement.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {earned && earnedData?.earned_date && (
                        <p className="text-xs text-primary pt-2">
                          Unlocked {new Date(earnedData.earned_date).toLocaleDateString()}
                        </p>
                      )}
                      {!earned && (
                        <p className="text-xs text-muted-foreground/60 pt-2">🔒 Locked</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Tips Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tips to Earn More Badges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Complete tasks to progress toward becoming a Task Master</p>
            <p>• Keep daily habits to build your streak and earn Habit Builder</p>
            <p>• Create notes to collect the Note Keeper achievement</p>
            <p>• Plan events in your calendar to unlock Time Keeper</p>
            <p>• Track your finances to achieve Money Wise status</p>
            <p>• Keep playing to unlock higher levels and rare achievements!</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
