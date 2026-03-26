import { useState, useEffect, FormEvent, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Building2, 
  Filter,
  ArrowUpRight,
  ChevronRight,
  UserCheck,
  UserX,
  Clock,
  X,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { dbService } from '../services/db';
import { Client } from '../types';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';

export function Clients() {
  const { profile, isAdmin, isEmployee } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'lead'>('all');
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'active' as const,
    notes: ''
  });

  useEffect(() => {
    if (!profile) return;

    const unsubscribe = dbService.subscribeCollection<Client>('clients', [], (data) => {
      setClients(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isEmployee, profile]);

  const handleAddClient = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    await dbService.addDocument('clients', {
      ...newClient,
      assignedEmployeeId: profile.uid, // Default to current user if employee, or admin can reassign later
    });

    setIsModalOpen(false);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'active',
      notes: ''
    });
  };

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchQuery, statusFilter]);

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailsModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus: any) => {
    if (!selectedClient) return;
    try {
      await dbService.updateDocument('clients', selectedClient.id, { status: newStatus });
      setIsStatusModalOpen(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleOpenStatusModal = (client: Client) => {
    setSelectedClient(client);
    setIsStatusModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">Client Management</h1>
          </div>
          <p className="text-slate-400">Manage your customer relationships and contact information.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 rounded-full bg-slate-900/50 px-3 py-1.5 border border-slate-800">
            <Info className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tip: Click "Add New Client" to expand your database</span>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="h-11 px-6 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Client
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input 
            placeholder="Search by name, email, or company..." 
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-11 rounded-xl border border-slate-800 bg-slate-950 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="lead">Lead</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-64 animate-pulse bg-slate-900/50" />
          ))
        ) : filteredClients.length > 0 ? (
          filteredClients.map((client, i) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group relative overflow-hidden border-slate-800/50 bg-slate-900/30 transition-all hover:border-cyan-500/30">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/5">
                    <span className="text-lg font-bold text-cyan-400 uppercase">{client.name.charAt(0)}</span>
                  </div>
                  <div 
                    onClick={() => handleOpenStatusModal(client)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all hover:scale-105",
                      client.status === 'active' 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : client.status === 'lead'
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                        : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    )}
                  >
                    {client.status === 'active' ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                    {client.status}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{client.name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                  <Building2 className="h-3.5 w-3.5" />
                  {client.company}
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Mail className="h-4 w-4 text-slate-600" />
                    {client.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Phone className="h-4 w-4 text-slate-600" />
                    {client.phone}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <Clock className="h-3.5 w-3.5" />
                    Last contact: 2d ago
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleViewDetails(client)}
                    className="h-8 w-8 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-slate-900 p-6">
              <Search className="h-12 w-12 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-white">No clients found</h3>
            <p className="text-slate-500">Try adjusting your search or add a new client</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Update Client Status"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 font-bold text-xl">
              {selectedClient?.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-white">{selectedClient?.name}</h4>
              <p className="text-sm text-slate-500">{selectedClient?.company}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'active', label: 'Active', color: 'emerald', icon: UserCheck },
              { id: 'lead', label: 'Lead', color: 'cyan', icon: Search },
              { id: 'inactive', label: 'Inactive', color: 'slate', icon: UserX }
            ].map((status) => (
              <button
                key={status.id}
                onClick={() => handleStatusUpdate(status.id)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border transition-all",
                  selectedClient?.status === status.id
                    ? `bg-${status.color}-500/10 border-${status.color}-500/30 text-${status.color}-400`
                    : "bg-slate-900/30 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <status.icon className="h-5 w-5" />
                  <span className="font-bold">{status.label}</span>
                </div>
                {selectedClient?.status === status.id && (
                  <div className={`h-2 w-2 rounded-full bg-${status.color}-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]`} />
                )}
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Client"
      >
        <form onSubmit={handleAddClient} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
            <Input
              required
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
            <Input
              required
              type="email"
              value={newClient.email}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
            <Input
              value={newClient.phone}
              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Company</label>
            <Input
              value={newClient.company}
              onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
              placeholder="Acme Corp"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Notes</label>
            <textarea
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              rows={3}
              value={newClient.notes}
              onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
              placeholder="Add any relevant notes..."
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
              Create Client
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Client Details"
      >
        {selectedClient && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                <span className="text-2xl font-bold text-cyan-400 uppercase">{selectedClient.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedClient.name}</h3>
                <p className="text-slate-400">{selectedClient.company}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Email</p>
                <p className="text-sm text-white">{selectedClient.email}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Phone</p>
                <p className="text-sm text-white">{selectedClient.phone}</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Notes</p>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedClient.notes || 'No notes available.'}</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-slate-800"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setIsStatusModalOpen(true);
                }}
              >
                Update Status
              </Button>
              <Button
                className="flex-1 rounded-xl"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
