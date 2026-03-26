import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Command, 
  Users, 
  CheckSquare, 
  FileText, 
  Settings, 
  Plus,
  Zap,
  Globe,
  MessageSquare,
  Calendar,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { role } = useAuth();

  const togglePalette = useCallback(() => setIsOpen(prev => !prev), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        togglePalette();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePalette]);

  const actions = [
    { 
      id: 'dashboard', 
      title: 'Dashboard', 
      icon: Zap, 
      category: 'Navigation', 
      action: () => navigate('/'),
      roles: ['admin', 'employee', 'client']
    },
    { 
      id: 'clients', 
      title: 'Clients', 
      icon: Users, 
      category: 'Navigation', 
      action: () => navigate('/clients'),
      roles: ['admin', 'employee']
    },
    { 
      id: 'tasks', 
      title: 'Tasks', 
      icon: CheckSquare, 
      category: 'Navigation', 
      action: () => navigate('/tasks'),
      roles: ['admin', 'employee', 'client']
    },
    { 
      id: 'pulsehub', 
      title: 'PulseHub', 
      icon: Globe, 
      category: 'Navigation', 
      action: () => navigate('/pulsehub'),
      roles: ['admin', 'employee', 'client']
    },
    { 
      id: 'add-client', 
      title: 'Add New Client', 
      icon: Plus, 
      category: 'Actions', 
      action: () => navigate('/clients'),
      roles: ['admin']
    },
    { 
      id: 'create-task', 
      title: 'Create New Task', 
      icon: CheckSquare, 
      category: 'Actions', 
      action: () => navigate('/tasks'),
      roles: ['admin', 'employee']
    },
    { 
      id: 'log-receipt', 
      title: 'Log Receipt', 
      icon: FileText, 
      category: 'Actions', 
      action: () => navigate('/receipts'),
      roles: ['admin', 'employee']
    },
    { 
      id: 'settings', 
      title: 'Settings', 
      icon: Settings, 
      category: 'System', 
      action: () => navigate('/settings'),
      roles: ['admin', 'employee', 'client']
    },
  ].filter(action => action.roles.includes(role || ''));

  const filteredActions = query === '' 
    ? actions 
    : actions.filter(action => 
        action.title.toLowerCase().includes(query.toLowerCase()) ||
        action.category.toLowerCase().includes(query.toLowerCase())
      );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
        >
          <div className="flex items-center border-b border-slate-800 px-4 py-4">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              autoFocus
              className="flex-1 bg-transparent px-4 text-lg text-white placeholder-slate-500 outline-none"
              placeholder="Search actions, pages, or commands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-2 rounded-lg bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="ml-4 rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {filteredActions.length > 0 ? (
              <div className="space-y-4 py-2">
                {['Navigation', 'Actions', 'System'].map(category => {
                  const items = filteredActions.filter(a => a.category === category);
                  if (items.length === 0) return null;

                  return (
                    <div key={category}>
                      <h3 className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        {category}
                      </h3>
                      <div className="space-y-1">
                        {items.map(action => (
                          <button
                            key={action.id}
                            onClick={() => {
                              action.action();
                              setIsOpen(false);
                            }}
                            className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-all hover:bg-slate-800 group"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950/50 border border-slate-800 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-all">
                              <action.icon className="h-5 w-5 text-slate-400 group-hover:text-cyan-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{action.title}</p>
                              <p className="text-xs text-slate-500">{action.category}</p>
                            </div>
                            <div className="hidden group-hover:block">
                              <Zap className="h-4 w-4 text-cyan-400 animate-pulse" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-slate-800 p-4">
                  <Search className="h-8 w-8 text-slate-500" />
                </div>
                <p className="text-sm font-medium text-slate-400">No results found for "{query}"</p>
                <p className="mt-1 text-xs text-slate-500 italic">Try searching for "Dashboard" or "Clients"</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/50 px-4 py-3">
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <div className="flex items-center gap-1">
                <span className="rounded bg-slate-800 px-1.5 py-0.5">↑↓</span>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="rounded bg-slate-800 px-1.5 py-0.5">Enter</span>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="rounded bg-slate-800 px-1.5 py-0.5">Esc</span>
                <span>Close</span>
              </div>
            </div>
            <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">
              PulseHub AI
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
