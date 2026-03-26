import { Search, Bell, User as UserIcon, Settings, LogOut, X, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export function Navbar() {
  const { profile, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Client Assigned', message: 'TechNova Solutions has been assigned to you.', time: '2m ago', read: false },
    { id: 2, title: 'Task Overdue', message: 'The BlueSky Proposal review is overdue.', time: '1h ago', read: false },
    { id: 3, title: 'Event Reminder', message: 'CRM Masterclass starts in 30 minutes.', time: '3h ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/50 bg-slate-950/50 px-8 backdrop-blur-xl">
      <div className="flex w-full max-w-md items-center gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input 
            placeholder="Search anything..." 
            className="h-9 pl-10 bg-slate-900/50 border-slate-800/50 focus-visible:ring-cyan-500/20" 
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative h-9 w-9 rounded-full p-0"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
          >
            <Bell className="h-5 w-5 text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            )}
          </Button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl shadow-black/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-3 rounded-xl border transition-colors ${n.read ? 'bg-slate-900/30 border-slate-800/50' : 'bg-cyan-500/5 border-cyan-500/20'}`}>
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-xs font-bold ${n.read ? 'text-slate-300' : 'text-cyan-400'}`}>{n.title}</p>
                        <span className="text-[10px] text-slate-500 font-medium">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-center text-xs text-slate-500 py-4">No notifications</p>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  onClick={markAllRead}
                  className="w-full mt-4 h-8 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white"
                >
                  Mark all as read
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="h-6 w-px bg-slate-800" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{profile?.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{profile?.role}</p>
          </div>
          <div className="relative">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px] cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-slate-900 text-xs font-bold text-white">
                {profile?.name?.charAt(0) || 'U'}
              </div>
            </motion.div>
            
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl z-50"
                >
                  <div className="px-3 py-2 border-b border-slate-800/50 mb-1">
                    <p className="text-xs font-bold text-white truncate">{profile?.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{profile?.email}</p>
                  </div>
                  <button 
                    onClick={() => logout()}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
