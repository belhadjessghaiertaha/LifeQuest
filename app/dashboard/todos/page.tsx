'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@supabase/supabase-js';
import { CheckSquare, Plus, Trash2, Circle, CheckCircle2 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Todo {
  id: string;
  content: string;
  is_completed: boolean;
  created_at: string;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data } = await supabase
        .from('todos')
        .select('*')
        .eq('user_email', 'Belhadjessghaiertaha@gmail.com')
        .order('created_at', { ascending: false });

      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsAdding(true);
    try {
      const { data } = await supabase
        .from('todos')
        .insert({
          content: content.trim(),
          is_completed: false,
          user_email: 'Belhadjessghaiertaha@gmail.com',
        })
        .select();

      if (data) {
        setTodos([...data, ...todos]);
        setContent('');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('todos')
        .update({ is_completed: !currentStatus })
        .eq('id', id);

      setTodos(todos.map((t) => (t.id === id ? { ...t, is_completed: !currentStatus } : t)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await supabase.from('todos').delete().eq('id', id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const activeTodos = todos.filter((t) => !t.is_completed);
  const completedTodos = todos.filter((t) => t.is_completed);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <CheckSquare className="w-8 h-8 text-primary" />
            To-Do List
          </h1>
          <p className="text-muted-foreground mt-1">Quick checklist for daily tasks</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Add To-Do</CardTitle>
              <CardDescription>Quick task entry</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTodo} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="What needs to be done?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isAdding || !content.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add To-Do
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active</CardTitle>
                <CardDescription>{activeTodos.length} items pending</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : activeTodos.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">All done! Add a new to-do to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeTodos.map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition"
                      >
                        <button
                          onClick={() => toggleTodo(todo.id, todo.is_completed)}
                          className="flex-shrink-0"
                        >
                          <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition" />
                        </button>
                        <p className="flex-1 text-foreground">{todo.content}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTodo(todo.id)}
                          className="text-destructive hover:bg-destructive/10 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {completedTodos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Completed</CardTitle>
                  <CardDescription>{completedTodos.length} items done</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {completedTodos.map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition opacity-60"
                      >
                        <button
                          onClick={() => toggleTodo(todo.id, todo.is_completed)}
                          className="flex-shrink-0"
                        >
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </button>
                        <p className="flex-1 text-foreground line-through">{todo.content}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTodo(todo.id)}
                          className="text-destructive hover:bg-destructive/10 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
