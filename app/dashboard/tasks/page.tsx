'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@supabase/supabase-js';
import { CheckSquare, Plus, Trash2, ChevronDown, AlertCircle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'completed';
  due_date: string | null;
}

const PRIORITY_COLORS = {
  high: 'text-red-600 bg-red-50 border-red-200',
  medium: 'text-orange-600 bg-orange-50 border-orange-200',
  low: 'text-green-600 bg-green-50 border-green-200',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_email', 'Belhadjessghaiertaha@gmail.com')
        .order('priority', { ascending: false });

      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsAdding(true);
    try {
      const { data } = await supabase
        .from('tasks')
        .insert({
          title,
          description,
          priority,
          due_date: dueDate || null,
          status: 'todo',
          user_email: 'Belhadjessghaiertaha@gmail.com',
        })
        .select();

      if (data) {
        setTasks([...tasks, ...data]);
        setTitle('');
        setDescription('');
        setPriority('medium');
        setDueDate('');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const updateTaskStatus = async (id: string, status: Task['status']) => {
    try {
      await supabase.from('tasks').update({ status }).eq('id', id);
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await supabase.from('tasks').delete().eq('id', id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    completed: tasks.filter((t) => t.status === 'completed'),
  };

  const TaskCard = ({ task, onStatusChange }: { task: Task; onStatusChange: (status: Task['status']) => void }) => (
    <div className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition">
      <div className="flex items-start gap-3">
        <button
          onClick={() => onStatusChange(task.status === 'completed' ? 'todo' : 'completed')}
          className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center transition ${
            task.status === 'completed'
              ? 'bg-primary border-primary'
              : 'border-muted-foreground hover:border-primary'
          }`}
        >
          {task.status === 'completed' && <span className="text-primary-foreground text-sm">✓</span>}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {task.title}
          </p>
          {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded border ${PRIORITY_COLORS[task.priority]}`}>
              {task.priority}
            </span>
            {task.due_date && (
              <span className="text-xs text-muted-foreground">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDeleteTask(task.id)}
          className="text-destructive hover:bg-destructive/10 flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <CheckSquare className="w-8 h-8 text-primary" />
            Task Manager
          </h1>
          <p className="text-muted-foreground mt-1">Organize and track your projects</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Task Card */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg">New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    placeholder="Task details"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Task['priority'])}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isAdding || !title}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Tasks Board */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {/* To Do */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">To Do ({tasksByStatus.todo.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {tasksByStatus.todo.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No tasks to do</p>
                    ) : (
                      tasksByStatus.todo.map((task) => (
                        <TaskCard key={task.id} task={task} onStatusChange={(status) => updateTaskStatus(task.id, status)} />
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* In Progress */}
                {tasksByStatus.in_progress.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">In Progress ({tasksByStatus.in_progress.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {tasksByStatus.in_progress.map((task) => (
                        <TaskCard key={task.id} task={task} onStatusChange={(status) => updateTaskStatus(task.id, status)} />
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Completed */}
                {tasksByStatus.completed.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Completed ({tasksByStatus.completed.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {tasksByStatus.completed.map((task) => (
                        <TaskCard key={task.id} task={task} onStatusChange={(status) => updateTaskStatus(task.id, status)} />
                      ))}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
