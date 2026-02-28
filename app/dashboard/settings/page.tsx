'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@supabase/supabase-js';
import { Settings, LogOut, Trash2, Save } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Profile {
  name: string;
  email: string;
  password_hash: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('name, email, password_hash')
        .eq('email', 'Belhadjessghaiertaha@gmail.com')
        .single();

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setSaveMessage('Please fill in both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setSaveMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setSaveMessage('Password must be at least 6 characters');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ password_hash: newPassword })
        .eq('email', 'Belhadjessghaiertaha@gmail.com');

      if (error) {
        setSaveMessage('Failed to update password');
      } else {
        setSaveMessage('Password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      setSaveMessage('An error occurred');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This will delete all your data and cannot be undone.')) {
      return;
    }

    try {
      // Delete all user data
      await supabase
        .from('events')
        .delete()
        .eq('user_email', 'Belhadjessghaiertaha@gmail.com');

      await supabase
        .from('tasks')
        .delete()
        .eq('user_email', 'Belhadjessghaiertaha@gmail.com');

      await supabase
        .from('notes')
        .delete()
        .eq('user_email', 'Belhadjessghaiertaha@gmail.com');

      await supabase
        .from('habits')
        .delete()
        .eq('user_email', 'Belhadjessghaiertaha@gmail.com');

      await supabase
        .from('habit_logs')
        .delete()
        .eq('user_email', 'Belhadjessghaiertaha@gmail.com');

      await supabase
        .from('transactions')
        .delete()
        .eq('user_email', 'Belhadjessghaiertaha@gmail.com');

      await supabase
        .from('achievements')
        .delete()
        .eq('user_email', 'Belhadjessghaiertaha@gmail.com');

      // Delete profile
      await supabase
        .from('profiles')
        .delete()
        .eq('email', 'Belhadjessghaiertaha@gmail.com');

      localStorage.removeItem('auth_token');
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setSaveMessage('Failed to delete account');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-8 h-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input value={profile?.name || ''} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={profile?.email || ''} disabled className="bg-muted" />
            </div>
            <p className="text-xs text-muted-foreground">
              Your profile information is fixed for this personal application.
            </p>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {saveMessage && (
                <div className={`text-sm p-2 rounded ${
                  saveMessage.includes('success')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {saveMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSaving}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <div className="space-y-4">
          {/* Logout */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Logout</CardTitle>
              <CardDescription>Sign out of your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </CardContent>
          </Card>

          {/* Delete Account */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-base text-destructive">Delete Account</CardTitle>
              <CardDescription>Permanently delete your account and all data</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="w-full justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About LifeQuest</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>LifeQuest v1.0</strong> - Your personal life management system powered by gamification.
            </p>
            <p>
              Built with Next.js, Supabase, and Tailwind CSS to help you organize your life and level up every day.
            </p>
            <p className="text-muted-foreground">
              Keep grinding, keep leveling, keep growing! 🚀
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
