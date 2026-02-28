'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@supabase/supabase-js';
import { BookOpen, Plus, Trash2, Bell } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  reminder_date: string | null;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data } = await supabase
        .from('notes')
        .select('*')
        .eq('user_email', 'Belhadjessghaiertaha@gmail.com')
        .order('created_at', { ascending: false });

      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsAdding(true);
    try {
      const { data } = await supabase
        .from('notes')
        .insert({
          title,
          content,
          reminder_date: reminderDate || null,
          user_email: 'Belhadjessghaiertaha@gmail.com',
        })
        .select();

      if (data) {
        setNotes([...data, ...notes]);
        setTitle('');
        setContent('');
        setReminderDate('');
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await supabase.from('notes').delete().eq('id', id);
      setNotes(notes.filter((n) => n.id !== id));
      if (selectedNote?.id === id) setSelectedNote(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            Notes & Reminders
          </h1>
          <p className="text-muted-foreground mt-1">Capture ideas and set reminders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Note Form */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg">New Note</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddNote} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    placeholder="Note title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content *</label>
                  <textarea
                    placeholder="Write your note here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground min-h-32"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reminder Date</label>
                  <Input
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isAdding || !title || !content}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Save Note
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notes List */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : notes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No notes yet. Create your first note!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <Card
                    key={note.id}
                    className={`cursor-pointer transition hover:border-primary/50 ${
                      selectedNote?.id === note.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedNote(note)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{note.title}</CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">{note.content}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                          className="text-destructive hover:bg-destructive/10 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span className="text-muted-foreground">
                          {new Date(note.created_at).toLocaleDateString()}
                        </span>
                        {note.reminder_date && (
                          <span className="flex items-center gap-1 text-accent">
                            <Bell className="w-3 h-3" />
                            {new Date(note.reminder_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Note Detail View */}
        {selectedNote && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle>{selectedNote.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">{selectedNote.content}</p>
              {selectedNote.reminder_date && (
                <div className="mt-4 flex items-center gap-2 text-sm text-accent">
                  <Bell className="w-4 h-4" />
                  Reminder set for {new Date(selectedNote.reminder_date).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
