import { useState, useEffect, FormEvent, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  Eye, 
  Filter,
  MoreVertical,
  DollarSign,
  Calendar,
  User,
  FileText,
  Receipt as ReceiptIcon,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { dbService } from '../services/db';
import { Receipt, Client } from '../types';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { serverTimestamp } from 'firebase/firestore';

export function Receipts() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilter, setClientFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReceipt, setNewReceipt] = useState({
    clientId: '',
    clientName: '',
    amount: 0,
    description: '',
    status: 'paid' as const
  });

  useEffect(() => {
    if (!profile) return;

    const constraints = [];
    if (profile.role === 'client') {
      constraints.push({ field: 'clientId', operator: '==', value: profile.uid });
    }

    const unsubscribe = dbService.subscribeCollection<Receipt>('receipts', constraints, (data) => {
      setReceipts(data.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
      setLoading(false);
    });

    // Fetch clients for the dropdown
    const unsubscribeClients = dbService.subscribeCollection<Client>('clients', [], (data) => {
      setClients(data);
    });

    return () => {
      unsubscribe();
      unsubscribeClients();
    };
  }, [profile]);

  const handleAddReceipt = async (e: FormEvent) => {
    e.preventDefault();
    if (!newReceipt.clientId || !newReceipt.amount) return;

    const selectedClient = clients.find(c => c.id === newReceipt.clientId);
    
    try {
      await dbService.addDocument('receipts', {
        ...newReceipt,
        clientName: selectedClient?.name || 'Unknown Client',
        createdAt: serverTimestamp(),
      });
      setIsModalOpen(false);
      setNewReceipt({
        clientId: '',
        clientName: '',
        amount: 0,
        description: '',
        status: 'paid'
      });
    } catch (error) {
      console.error('Error adding receipt:', error);
    }
  };

  const filteredReceipts = useMemo(() => {
    return receipts.filter(receipt => {
      const matchesSearch = receipt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receipt.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesClient = clientFilter === 'all' || receipt.clientId === clientFilter;
      
      return matchesSearch && matchesClient;
    });
  }, [receipts, searchQuery, clientFilter]);

  const handleDownload = (receipt: Receipt) => {
    alert(`Downloading receipt for ${receipt.clientName} ($${receipt.amount})...`);
    // In a real app, this would generate a PDF or trigger a download link
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">Financial Records</h1>
          </div>
          <p className="text-slate-400">Track payments, invoices, and financial transactions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 rounded-full bg-slate-900/50 px-3 py-1.5 border border-slate-800">
            <Info className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tip: Export receipts as PDF for your clients</span>
          </div>
          {profile?.role !== 'client' && (
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="h-11 px-6 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Receipt
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input 
            placeholder="Search receipts..." 
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <select 
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="h-11 rounded-xl border border-slate-800 bg-slate-950 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Clients</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-64 animate-pulse bg-slate-900/50" />
          ))
        ) : filteredReceipts.length > 0 ? (
          filteredReceipts.map((receipt, i) => (
            <motion.div
              key={receipt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group relative overflow-hidden border-slate-800/50 bg-slate-900/30 transition-all hover:border-emerald-500/30">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <DollarSign className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                    {receipt.status}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-1">${receipt.amount.toLocaleString()}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Transaction Amount</p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <User className="h-4 w-4 text-slate-600" />
                    {receipt.clientName}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Calendar className="h-4 w-4 text-slate-600" />
                    {receipt.createdAt ? format(receipt.createdAt.toDate(), 'MMM dd, yyyy') : 'Pending...'}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <FileText className="h-4 w-4 text-slate-600" />
                    {receipt.description}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800"
                      onClick={() => navigate(`/receipts/${receipt.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800"
                      onClick={() => handleDownload(receipt)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => alert('More actions coming soon!')}
                    className="h-8 w-8 rounded-lg text-slate-500 hover:text-white"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-slate-900 p-6">
              <ReceiptIcon className="h-12 w-12 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-white">No receipts found</h3>
            <p className="text-slate-500">Create your first financial record to start tracking revenue</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Receipt"
      >
        <form onSubmit={handleAddReceipt} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Client</label>
            <select
              className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              value={newReceipt.clientId}
              onChange={(e) => setNewReceipt({ ...newReceipt, clientId: e.target.value })}
              required
            >
              <option value="">Select a client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Amount ($)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={newReceipt.amount}
              onChange={(e) => setNewReceipt({ ...newReceipt, amount: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <Input
              placeholder="e.g., Monthly Service Fee"
              value={newReceipt.description}
              onChange={(e) => setNewReceipt({ ...newReceipt, description: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Receipt
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
