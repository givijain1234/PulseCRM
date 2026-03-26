import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  ArrowUpRight,
  Globe,
  MessageSquare,
  Calendar,
  Database,
  Info,
  Sparkles,
  CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { dbService } from '../services/db';
import { Client, Receipt, Task, Post } from '../types';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';
import { seedDatabase } from '../services/seedData';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

export function Dashboard() {
  const navigate = useNavigate();
  const { profile, isAdmin } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedAttempted, setSeedAttempted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'30' | '90'>('30');

  useEffect(() => {
    const checkAndSeed = async () => {
      // Auto-seed ONLY for admin users if the database is empty
      // We check if loading is false (initial fetch done) and clients is empty
      if (loading === false && clients.length === 0 && !isSeeding && !seedAttempted && profile?.role === 'admin') {
        setSeedAttempted(true);
        setIsSeeding(true);
        try {
          await seedDatabase(profile?.uid);
          // No need to reload, subscribeCollection will pick up changes
        } catch (error) {
          console.error('Auto-seeding failed:', error);
        } finally {
          setIsSeeding(false);
        }
      }
    };
    checkAndSeed();
  }, [clients.length, loading, isSeeding, seedAttempted, profile?.role]);

  useEffect(() => {
    if (!profile) return;
    setLoading(true);

    const clientConstraints = [];
    const receiptConstraints = [];
    const taskConstraints = [];

    if (profile.role === 'employee') {
      // Employees see all clients and receipts according to requirements
      taskConstraints.push({ field: 'assignedToId', operator: '==', value: profile.uid });
    } else if (profile.role === 'client') {
      clientConstraints.push({ field: 'email', operator: '==', value: profile.email });
      receiptConstraints.push({ field: 'clientId', operator: '==', value: profile.uid });
      taskConstraints.push({ field: 'clientId', operator: '==', value: profile.uid });
    }

    const unsubClients = dbService.subscribeCollection<Client>('clients', clientConstraints, setClients, () => setLoading(false));
    const unsubReceipts = dbService.subscribeCollection<Receipt>('receipts', receiptConstraints, setReceipts, () => setLoading(false));
    const unsubTasks = dbService.subscribeCollection<Task>('tasks', taskConstraints, setTasks, () => setLoading(false));
    const unsubPosts = dbService.subscribeCollection<Post>('posts', [], (data) => {
      setPosts(data.slice(0, 3));
      setLoading(false);
    }, () => setLoading(false));

    return () => {
      unsubClients();
      unsubReceipts();
      unsubTasks();
      unsubPosts();
    };
  }, [profile]);

  const totalRevenue = receipts.reduce((sum, r) => sum + r.amount, 0);
  const activeClients = clients.filter(c => c.status === 'active').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;

  const renderAdminDashboard = () => {
    const stats = [
      { 
        label: 'Total Revenue', 
        value: timeRange === '30' ? `$${totalRevenue.toLocaleString()}` : `$${(totalRevenue * 2.8).toLocaleString()}`, 
        icon: DollarSign, 
        trend: '+12.5%', 
        color: 'text-emerald-400', 
        bg: 'bg-emerald-500/10' 
      },
      { 
        label: 'Active Clients', 
        value: activeClients.toString(), 
        icon: Users, 
        trend: '+4.2%', 
        color: 'text-cyan-400', 
        bg: 'bg-cyan-500/10' 
      },
      { 
        label: 'Pending Tasks', 
        value: pendingTasks.toString(), 
        icon: Clock, 
        trend: '-2.1%', 
        color: 'text-purple-400', 
        bg: 'bg-purple-500/10' 
      },
      { 
        label: 'Community Posts', 
        value: posts.length.toString(), 
        icon: Globe, 
        trend: '+18%', 
        color: 'text-blue-400', 
        bg: 'bg-blue-500/10' 
      },
    ];

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group relative overflow-hidden border-slate-800/50 bg-slate-900/30 transition-all hover:border-cyan-500/30">
                <div className={stat.bg + " absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl transition-opacity group-hover:opacity-100 opacity-50"} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={stat.bg + " p-2.5 rounded-xl border border-white/5"}>
                      <stat.icon className={stat.color + " h-5 w-5"} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stat.trend.startsWith('+') ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {stat.trend}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <Card className="lg:col-span-8 border-slate-800/50 bg-slate-900/30">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Revenue Growth</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Monthly Performance</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-slate-500" />
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeRange === '30' ? [
                  { name: 'Week 1', value: 4200 },
                  { name: 'Week 2', value: 3800 },
                  { name: 'Week 3', value: 5400 },
                  { name: 'Week 4', value: 6200 },
                ] : [
                  { name: 'Jan', value: 12000 },
                  { name: 'Feb', value: 15400 },
                  { name: 'Mar', value: 18900 },
                  { name: 'Apr', value: 21000 },
                  { name: 'May', value: 24500 },
                  { name: 'Jun', value: 28000 },
                ]}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="lg:col-span-4 border-slate-800/50 bg-slate-900/30">
            <h3 className="mb-6 text-lg font-bold text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-cyan-500" />
              PulseHub Activity
            </h3>
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-full before:w-px before:bg-slate-800 last:before:h-2">
                  <div className="absolute left-[-4px] top-2 h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                  <div className="group cursor-pointer">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">New Post</p>
                    <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{post.title}</h4>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 font-bold uppercase">
                      <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post.commentsCount}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Today</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/pulsehub')}
              className="mt-8 w-full rounded-xl bg-slate-800/50 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
            >
              View All Activity
            </button>
          </Card>
        </div>
      </div>
    );
  };

  const renderEmployeeDashboard = () => {
    const stats = [
      { 
        label: 'My Tasks', 
        value: tasks.length.toString(), 
        icon: CheckSquare, 
        trend: 'Active', 
        color: 'text-cyan-400', 
        bg: 'bg-cyan-500/10' 
      },
      { 
        label: 'Total Clients', 
        value: clients.length.toString(), 
        icon: Users, 
        trend: 'Overview', 
        color: 'text-purple-400', 
        bg: 'bg-purple-500/10' 
      },
      { 
        label: 'Upcoming Events', 
        value: '4', 
        icon: Calendar, 
        trend: 'Next 7d', 
        color: 'text-amber-400', 
        bg: 'bg-amber-500/10' 
      },
      { 
        label: 'PulseHub Posts', 
        value: posts.length.toString(), 
        icon: Globe, 
        trend: 'Community', 
        color: 'text-blue-400', 
        bg: 'bg-blue-500/10' 
      },
    ];

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group relative overflow-hidden border-slate-800/50 bg-slate-900/30 transition-all hover:border-cyan-500/30">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={stat.bg + " p-2.5 rounded-xl border border-white/5"}>
                      <stat.icon className={stat.color + " h-5 w-5"} />
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {stat.trend}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="border-slate-800/50 bg-slate-900/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">My Priority Tasks</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')} className="text-cyan-400 hover:text-cyan-300">View All</Button>
            </div>
            <div className="space-y-4">
              {tasks.length > 0 ? tasks.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/50 hover:border-cyan-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      task.priority === 'high' ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" :
                      task.priority === 'medium' ? "bg-amber-500" : "bg-slate-500"
                    )} />
                    <div>
                      <h4 className="text-sm font-bold text-white">{task.title}</h4>
                      <p className="text-xs text-slate-500">Due: {task.dueDate ? new Date(task.dueDate.toDate()).toLocaleDateString() : 'No date'}</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 py-1 rounded bg-slate-900 border border-slate-800">
                    {task.status}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-sm italic">No tasks assigned to you yet.</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="border-slate-800/50 bg-slate-900/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Recent Clients</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/clients')} className="text-cyan-400 hover:text-cyan-300">View All</Button>
            </div>
            <div className="space-y-4">
              {clients.slice(0, 5).map(client => (
                <div key={client.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/50 hover:border-purple-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center border border-white/5">
                      <span className="text-sm font-bold text-cyan-400">{client.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{client.name}</h4>
                      <p className="text-xs text-slate-500">{client.company}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border",
                    client.status === 'active' ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" : "text-slate-400 border-slate-800 bg-slate-900"
                  )}>
                    {client.status}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <Card className="lg:col-span-8 border-slate-800/50 bg-slate-900/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Upcoming Events</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/events')} className="text-cyan-400 hover:text-cyan-300">View Calendar</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'CRM Mastery Webinar', date: 'Apr 02, 2026', time: '10:00 AM', type: 'Webinar' },
                { title: 'Sales Growth Workshop', date: 'Apr 09, 2026', time: '02:00 PM', type: 'Workshop' },
                { title: 'Tech Mixer', date: 'Apr 15, 2026', time: '06:30 PM', type: 'Networking' },
                { title: 'Product Launch', date: 'May 01, 2026', time: '09:00 AM', type: 'Event' },
              ].map((event, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/50 hover:border-amber-500/30 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                      <Calendar className="h-4 w-4 text-amber-400" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">{event.type}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{event.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500 font-bold uppercase">
                    <span>{event.date}</span>
                    <span>{event.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-4 border-slate-800/50 bg-slate-900/30">
            <h3 className="mb-6 text-lg font-bold text-white">PulseHub Feed</h3>
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="group cursor-pointer">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-500 mb-1">{post.category}</p>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">{post.title}</h4>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 font-bold uppercase">
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post.commentsCount}</span>
                    <span>{post.authorName}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="mt-8 w-full border-slate-800 text-xs font-bold"
              onClick={() => navigate('/pulsehub')}
            >
              Go to PulseHub
            </Button>
          </Card>
        </div>
      </div>
    );
  };

  const renderClientDashboard = () => {
    const stats = [
      { 
        label: 'Project Progress', 
        value: '84%', 
        icon: TrendingUp, 
        trend: 'On Track', 
        color: 'text-emerald-400', 
        bg: 'bg-emerald-500/10' 
      },
      { 
        label: 'Support Tickets', 
        value: '2', 
        icon: MessageSquare, 
        trend: 'Active', 
        color: 'text-cyan-400', 
        bg: 'bg-cyan-500/10' 
      },
      { 
        label: 'Total Spent', 
        value: `$${totalRevenue.toLocaleString()}`, 
        icon: DollarSign, 
        trend: 'All Time', 
        color: 'text-purple-400', 
        bg: 'bg-purple-500/10' 
      },
      { 
        label: 'Upcoming Tasks', 
        value: tasks.length.toString(), 
        icon: Clock, 
        trend: 'Action Items', 
        color: 'text-amber-400', 
        bg: 'bg-amber-500/10' 
      },
    ];

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group relative overflow-hidden border-slate-800/50 bg-slate-900/30 transition-all hover:border-cyan-500/30">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={stat.bg + " p-2.5 rounded-xl border border-white/5"}>
                      <stat.icon className={stat.color + " h-5 w-5"} />
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {stat.trend}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <Card className="lg:col-span-7 border-slate-800/50 bg-slate-900/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Recent Receipts</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/receipts')} className="text-cyan-400 hover:text-cyan-300">View All</Button>
            </div>
            <div className="space-y-4">
              {receipts.length > 0 ? receipts.slice(0, 5).map(receipt => (
                <div key={receipt.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/50 hover:border-cyan-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <DollarSign className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{receipt.description}</h4>
                      <p className="text-xs text-slate-500">{new Date(receipt.date.toDate()).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-white">
                    ${receipt.amount.toLocaleString()}
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <Database className="h-10 w-10 text-slate-800 mx-auto mb-3" />
                  <p className="text-slate-500">No receipts found.</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="lg:col-span-5 border-slate-800/50 bg-slate-900/30">
            <h3 className="mb-6 text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Project Milestones
            </h3>
            <div className="space-y-6">
              {[
                { title: 'Initial Strategy Session', date: 'Completed', status: 'done' },
                { title: 'Brand Identity Design', date: 'Completed', status: 'done' },
                { title: 'CRM Implementation', date: 'In Progress', status: 'active' },
                { title: 'Staff Training', date: 'Scheduled: Apr 15', status: 'pending' },
              ].map((milestone, i) => (
                <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-full before:w-px before:bg-slate-800 last:before:h-2">
                  <div className={cn(
                    "absolute left-[-4px] top-2 h-2 w-2 rounded-full",
                    milestone.status === 'done' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" :
                    milestone.status === 'active' ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] animate-pulse" :
                    "bg-slate-700"
                  )} />
                  <div>
                    <h4 className={cn("text-sm font-bold", milestone.status === 'done' ? "text-slate-400 line-through" : "text-white")}>
                      {milestone.title}
                    </h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">{milestone.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="border-slate-800/50 bg-slate-900/30">
            <h3 className="mb-6 text-lg font-bold text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-cyan-500" />
              Service Status
            </h3>
            <div className="space-y-4">
              {[
                { label: 'CRM Platform', status: 'Operational', color: 'text-emerald-400' },
                { label: 'API Integration', status: 'Operational', color: 'text-emerald-400' },
                { label: 'Support Queue', status: 'Normal', color: 'text-emerald-400' },
                { label: 'Cloud Storage', status: 'Operational', color: 'text-emerald-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/30 border border-slate-800/50">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className={cn("text-xs font-bold uppercase tracking-widest", item.color)}>{item.status}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-slate-800/50 bg-slate-900/30">
            <h3 className="mb-6 text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Next Meeting
            </h3>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Monthly Strategy Review</h4>
                  <p className="text-xs text-slate-400">With Aarav Mehta (Admin)</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Tomorrow, 10:00 AM
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] h-8">Join Meeting</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
          <p className="text-slate-400">Welcome back, {profile?.name}! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-xl bg-slate-900/50 p-1 border border-slate-800">
            <button 
              onClick={() => setTimeRange('30')}
              className={cn(
                "rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200",
                timeRange === '30' 
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              Last 30 Days
            </button>
            <button 
              onClick={() => setTimeRange('90')}
              className={cn(
                "rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200",
                timeRange === '90' 
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              Last 90 Days
            </button>
          </div>
        </div>
      </div>

      {profile?.role === 'admin' && renderAdminDashboard()}
      {profile?.role === 'employee' && renderEmployeeDashboard()}
      {profile?.role === 'client' && renderClientDashboard()}

      <AnimatePresence>
        {isSeeding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md"
          >
            <div className="text-center space-y-6 max-w-md px-6">
              <div className="relative inline-block">
                <div className="h-24 w-24 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                <Database className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-cyan-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Initializing PulseCRM</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We're setting up your workspace with demo data to help you get started. This will only take a moment.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="h-1 w-1 rounded-full bg-cyan-500 animate-bounce [animation-delay:-0.3s]" />
                <div className="h-1 w-1 rounded-full bg-cyan-500 animate-bounce [animation-delay:-0.15s]" />
                <div className="h-1 w-1 rounded-full bg-cyan-500 animate-bounce" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
