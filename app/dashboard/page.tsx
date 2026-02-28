'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import OverviewModule from '@/components/modules/OverviewModule';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckSquare, BookOpen, Bell, Zap, DollarSign, Trophy, Settings } from 'lucide-react';

const MODULE_CARDS = [
  {
    id: 'calendar',
    title: 'Calendar & Events',
    description: 'Plan your events and milestones',
    icon: Calendar,
    href: '/dashboard/calendar',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'tasks',
    title: 'Task Manager',
    description: 'Organize your projects and tasks',
    icon: CheckSquare,
    href: '/dashboard/tasks',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'todos',
    title: 'To-Do List',
    description: 'Quick checklist for daily tasks',
    icon: CheckSquare,
    href: '/dashboard/todos',
    color: 'from-teal-500 to-teal-600',
  },
  {
    id: 'notes',
    title: 'Notes & Reminders',
    description: 'Capture ideas and set reminders',
    icon: BookOpen,
    href: '/dashboard/notes',
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 'habits',
    title: 'Habit Tracker',
    description: 'Build and track your habits',
    icon: Zap,
    href: '/dashboard/habits',
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'money',
    title: 'Money Manager',
    description: 'Track income and expenses (TND)',
    icon: DollarSign,
    href: '/dashboard/money',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'achievements',
    title: 'Achievements',
    description: 'Unlock badges and rewards',
    icon: Trophy,
    href: '/dashboard/achievements',
    color: 'from-yellow-500 to-yellow-600',
  },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/');
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground mb-4 animate-pulse">
            <span className="text-xl font-bold">✨</span>
          </div>
          <p className="text-muted-foreground">Loading your LifeQuest...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <OverviewModule />

        {/* Modules Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Your Modules</h2>
              <p className="text-muted-foreground">Explore and manage all aspects of your life</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULE_CARDS.map((module) => {
              const Icon = module.icon;
              return (
                <Card
                  key={module.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border-border/50"
                  onClick={() => router.push(module.href)}
                >
                  <div className={`h-2 bg-gradient-to-r ${module.color}`} />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription className="mt-1">{module.description}</CardDescription>
                      </div>
                      <Icon className="w-6 h-6 text-primary ml-2 mt-1" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-primary hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(module.href);
                      }}
                    >
                      Explore →
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
