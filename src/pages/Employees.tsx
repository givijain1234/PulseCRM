import { useState, useEffect, FormEvent } from 'react';
import { 
  Plus, 
  Search, 
  Shield, 
  Mail, 
  Calendar, 
  Filter,
  MoreVertical,
  Award,
  Briefcase,
  CheckCircle2,
  Users,
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { dbService } from '../services/db';
import { UserProfile } from '../types';
import { where } from 'firebase/firestore';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';

export function Employees() {
  const { isAdmin } = useAuth();
  const [employees, setEmployees] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: 'employee' as const
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = dbService.subscribeCollection<UserProfile>(
      'users', 
      [where('role', '==', 'employee')], 
      (data) => {
        setEmployees(data);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAddEmployee = async (e: FormEvent) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email) return;

    setIsSubmitting(true);
    setError(null);
    try {
      // In a real app, we would use Firebase Auth to create the user.
      // For this demo, we'll just add a profile to the 'users' collection.
      const uid = `emp-${Date.now()}`;
      await dbService.setDocument('users', uid, {
        uid,
        name: newEmployee.name,
        email: newEmployee.email,
        role: 'employee',
        createdAt: new Date().toISOString()
      });
      
      setIsModalOpen(false);
      setNewEmployee({ name: '', email: '', role: 'employee' });
    } catch (err: any) {
      console.error('Error adding employee:', err);
      setError('Failed to add employee. Please check your permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Employee Directory</h1>
          <p className="text-slate-400">Manage your team members, roles, and permissions.</p>
        </div>
        {isAdmin && (
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="h-11 px-6 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
            >
              <Card className="border-slate-800 bg-slate-900 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Add New Employee</h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleAddEmployee} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Full Name</label>
                    <Input 
                      required
                      placeholder="John Doe"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                      className="bg-slate-950 border-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Email Address</label>
                    <Input 
                      required
                      type="email"
                      placeholder="john@example.com"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                      className="bg-slate-950 border-slate-800"
                    />
                  </div>
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-11 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold shadow-lg shadow-cyan-500/20"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Create Employee Profile'
                      )}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input 
            placeholder="Search employees..." 
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11 rounded-xl border-slate-800">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="h-64 animate-pulse bg-slate-900/50" />
          ))
        ) : filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee, i) => (
            <motion.div
              key={employee.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group relative overflow-hidden border-slate-800/50 bg-slate-900/30 transition-all hover:border-purple-500/30">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/5">
                      <span className="text-2xl font-bold text-purple-400 uppercase">{employee.name.charAt(0)}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg bg-slate-950 border border-slate-800">
                      <Shield className="h-3 w-3 text-cyan-500" />
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-white">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{employee.name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                  <Briefcase className="h-3.5 w-3.5" />
                  Product Engineer
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Mail className="h-4 w-4 text-slate-600" />
                    {employee.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Calendar className="h-4 w-4 text-slate-600" />
                    Joined March 2024
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Top Performer</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Active
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-slate-900 p-6">
              <Users className="h-12 w-12 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-white">No employees found</h3>
            <p className="text-slate-500">Add your first team member to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
