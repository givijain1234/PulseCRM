import { useState, useEffect, FormEvent, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter,
  MoreVertical,
  Calendar,
  User,
  Tag,
  X,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { dbService } from '../services/db';
import { Task, Client } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';

export function Tasks() {
  const { profile, isAdmin, isEmployee, isClient } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    clientId: '',
    status: 'pending' as const,
    priority: 'medium' as const,
    dueDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    tags: ''
  });

  useEffect(() => {
    if (!profile) return;

    const unsubTasks = dbService.subscribeCollection<Task>('tasks', [], (data) => {
      let filteredData = data;
      if (isClient && profile) {
        filteredData = data.filter(t => t.clientId === profile.uid);
      } else if (isEmployee && profile) {
        filteredData = data.filter(t => t.assignedToId === profile.uid);
      }
      setTasks(filteredData.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      }));
      setLoading(false);
    });

    const unsubClients = dbService.subscribeCollection<Client>('clients', [], setClients);

    return () => {
      unsubTasks();
      unsubClients();
    };
  }, [isClient, isEmployee, profile]);

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    await dbService.addDocument('tasks', {
      ...newTask,
      dueDate: new Date(newTask.dueDate),
      tags: newTask.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      assignedToName: profile.name,
      assignedToId: profile.uid,
    });

    setIsModalOpen(false);
    setNewTask({
      title: '',
      description: '',
      clientId: '',
      status: 'pending',
      priority: 'medium',
      dueDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      tags: ''
    });
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, priorityFilter, statusFilter]);

  const handleUpdateStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      await dbService.updateDocument('tasks', taskId, { status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await dbService.deleteDocument('tasks', taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'in-progress': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      default: return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">Task Management</h1>
          </div>
          <p className="text-slate-400">Track project progress and team responsibilities.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 rounded-full bg-slate-900/50 px-3 py-1.5 border border-slate-800">
            <Info className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tip: Filter tasks by priority to focus on urgent items</span>
          </div>
          {!isClient && (
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="h-11 px-6 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Task
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="h-11 rounded-xl border border-slate-800 bg-slate-950 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-11 rounded-xl border border-slate-800 bg-slate-950 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-64 animate-pulse bg-slate-900/50" />
          ))
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group relative overflow-hidden border-slate-800/50 bg-slate-900/30 transition-all hover:border-cyan-500/30">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                    getStatusColor(task.status)
                  )}>
                    {task.status === 'completed' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {task.status}
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                    getPriorityColor(task.priority)
                  )}>
                    <AlertCircle className="h-3 w-3" />
                    {task.priority}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">{task.title}</h3>
                <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">{task.description}</p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-slate-600" />
                      Assigned to: {task.assignedToName}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-600" />
                      Due: {task.dueDate ? format(task.dueDate.toDate(), 'MMM dd, yyyy') : 'No date'}
                    </div>
                  </div>
                </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                    <div className="flex gap-2">
                      {task.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                          <Tag className="h-3 w-3" /> {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      {task.status !== 'completed' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleUpdateStatus(task.id, 'completed')}
                          className="h-8 px-2 rounded-lg text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/5 text-[10px] font-bold uppercase tracking-widest"
                        >
                          Complete
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteTask(task.id)}
                        className="h-8 w-8 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/5"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-slate-900 p-6">
              <CheckCircle2 className="h-12 w-12 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-white">No tasks found</h3>
            <p className="text-slate-500">Create your first task to start tracking progress</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
      >
        <form onSubmit={handleAddTask} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Task Title</label>
            <Input
              required
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Design new landing page"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Description</label>
            <textarea
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              rows={3}
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Detailed description of the task..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Client</label>
              <select
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={newTask.clientId}
                onChange={(e) => setNewTask({ ...newTask, clientId: e.target.value })}
              >
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Priority</label>
              <select
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Due Date</label>
            <Input
              required
              type="datetime-local"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tags (comma separated)</label>
            <Input
              value={newTask.tags}
              onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
              placeholder="design, web, urgent"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl border-slate-800"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
