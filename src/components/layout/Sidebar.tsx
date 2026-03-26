import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Receipt, 
  CheckSquare, 
  Settings, 
  LogOut, 
  Activity,
  ShieldCheck,
  Briefcase,
  Globe,
  CalendarDays,
  Bell,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export function Sidebar() {
  const { profile, logout, isAdmin, isEmployee, isClient } = useAuth();
  const [activities, setActivities] = useState([
    { id: 1, text: 'Riya Sharma commented on your post', time: '2m ago' },
    { id: 2, text: 'New client "TechNova" added', time: '15m ago' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivities = [
        { id: Date.now(), text: 'Vikram Singh updated a task', time: 'Just now' },
        { id: Date.now() + 1, text: 'New event registered: CRM Mastery', time: 'Just now' },
        { id: Date.now() + 2, text: 'Payment received from GreenLeaf', time: 'Just now' },
      ];
      const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];
      setActivities(prev => [randomActivity, ...prev.slice(0, 2)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['admin', 'employee', 'client'] },
    { icon: Globe, label: 'PulseHub', path: '/pulsehub', roles: ['admin', 'employee', 'client'] },
    { icon: CalendarDays, label: 'Events', path: '/events', roles: ['admin', 'employee', 'client'] },
    { icon: Users, label: 'Clients', path: '/clients', roles: ['admin', 'employee'] },
    { icon: Briefcase, label: 'Employees', path: '/employees', roles: ['admin'] },
    { icon: Receipt, label: 'Receipts', path: '/receipts', roles: ['admin', 'employee', 'client'] },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks', roles: ['admin', 'employee', 'client'] },
    { icon: Activity, label: 'Logs', path: '/logs', roles: ['admin'] },
  ];

  const filteredItems = navItems.filter(item => profile && item.roles.includes(profile.role));

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-800/50 bg-slate-950/40 backdrop-blur-2xl transition-transform">
      <div className="flex h-full flex-col px-4 py-8">
        <div className="mb-12 flex items-center gap-3 px-3">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            <Activity className="h-6 w-6 text-white" />
          </motion.div>
          <span className="text-2xl font-bold tracking-tighter text-white">Pulse<span className="text-cyan-500">CRM</span></span>
        </div>

        <nav className="flex-1 space-y-1.5 px-2">
          {filteredItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-white")} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}

          <div className="pt-8 px-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Live Activity</h3>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="group cursor-default"
                  >
                    <p className="text-[11px] leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                      {activity.text}
                    </p>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{activity.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </nav>

        <div className="mt-auto pt-8">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/5" 
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
