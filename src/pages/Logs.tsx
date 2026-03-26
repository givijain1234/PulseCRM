import { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Database, 
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronRight,
  Shield,
  Cpu,
  Zap,
  UserPlus,
  Brain,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { dbService } from '../services/db';
import { Log } from '../types';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';

export function Logs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'security' | 'system' | 'user'>('all');

  useEffect(() => {
    const unsubscribe = dbService.subscribeCollection<Log>('logs', [], (data) => {
      setLogs(data.sort((a, b) => {
        const timeA = a.timestamp?.toMillis() || 0;
        const timeB = b.timestamp?.toMillis() || 0;
        return timeB - timeA;
      }));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || log.type === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getLogConfig = (type: string = 'system', action: string = '') => {
    const lowerAction = action.toLowerCase();
    
    if (type === 'security' || lowerAction.includes('security')) {
      return {
        icon: <Shield className="h-4 w-4" />,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        label: 'Security'
      };
    }
    if (type === 'ai' || lowerAction.includes('ai')) {
      return {
        icon: <Brain className="h-4 w-4" />,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        label: 'AI Insight'
      };
    }
    if (type === 'user' || lowerAction.includes('user')) {
      return {
        icon: <UserPlus className="h-4 w-4" />,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        label: 'User Action'
      };
    }
    if (type === 'warning' || lowerAction.includes('alert')) {
      return {
        icon: <Zap className="h-4 w-4" />,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        label: 'System Alert'
      };
    }
    return {
      icon: <Terminal className="h-4 w-4" />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      label: 'System'
    };
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">System Pulse</h1>
            <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-500/20">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Feed</span>
            </div>
          </div>
          <p className="text-slate-400 font-medium">Real-time audit trail of all neural activities across the PulseCRM network.</p>
        </div>
        
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
          {(['all', 'security', 'system', 'user'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest",
                activeTab === tab 
                  ? "bg-white text-slate-950 shadow-lg" 
                  : "text-slate-500 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
        <Input 
          placeholder="Query the audit stream..." 
          className="pl-12 h-14 bg-slate-900/30 border-slate-800/50 text-lg font-medium placeholder:text-slate-600 focus:ring-cyan-500/20"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-slate-800 bg-slate-950 px-1.5 font-mono text-[10px] font-medium text-slate-500">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-slate-800 to-transparent" />

        <div className="space-y-6 relative">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-6 animate-pulse">
                <div className="h-16 w-16 rounded-2xl bg-slate-900/50 shrink-0" />
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-4 w-1/4 rounded bg-slate-900/50" />
                  <div className="h-4 w-3/4 rounded bg-slate-900/50" />
                </div>
              </div>
            ))
          ) : filteredLogs.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredLogs.map((log, i) => {
                const config = getLogConfig(log.type, log.action);
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-6 group"
                  >
                    {/* Icon Container */}
                    <div className="relative shrink-0">
                      <div className={cn(
                        "h-16 w-16 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-2xl",
                        config.bg, config.border, config.color
                      )}>
                        {config.icon}
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shadow-xl">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                    </div>

                    {/* Content */}
                    <Card className="flex-1 border-slate-800/50 bg-slate-900/20 backdrop-blur-sm p-5 hover:border-slate-700 transition-all group-hover:bg-slate-900/40">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border", config.bg, config.border, config.color)}>
                            {config.label}
                          </span>
                          <h3 className="text-lg font-bold text-white tracking-tight">{log.action}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          <Clock className="h-3 w-3" />
                          {log.timestamp ? formatDistanceToNow(log.timestamp.toDate(), { addSuffix: true }) : 'just now'}
                        </div>
                      </div>

                      <p className="text-slate-400 text-sm leading-relaxed mb-4 font-medium">
                        {log.details}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white border border-slate-700">
                            {log.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-300">{log.userName}</p>
                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Authorized Operator</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </div>
                          <button className="text-slate-600 hover:text-white transition-colors">
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="relative mb-6">
                <Database className="h-20 w-20 text-slate-900" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="h-8 w-8 text-slate-800 animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">The stream is silent</h3>
              <p className="text-slate-500 max-w-xs mx-auto">No activities detected in the neural network matching your current filters.</p>
              <Button 
                variant="outline" 
                className="mt-8 border-slate-800 hover:bg-slate-900"
                onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Stream
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
