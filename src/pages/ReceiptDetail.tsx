import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Mail, 
  Phone,
  Activity,
  DollarSign
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { dbService } from '../services/db';
import { Receipt } from '../types';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';

export default function ReceiptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      dbService.getDocument<Receipt>('receipts', id).then(data => {
        setReceipt(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f172a]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-xl font-bold text-white">Receipt not found</h3>
        <Button onClick={() => navigate('/receipts')} className="mt-4">Back to Receipts</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/receipts')} className="text-slate-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Receipts
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint} className="border-slate-800 text-slate-400 hover:text-white">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card ref={receiptRef} className="overflow-hidden border-slate-800/50 bg-white p-0 text-slate-900 shadow-2xl print:shadow-none">
            {/* Receipt Header */}
            <div className="bg-slate-950 p-12 text-white">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold tracking-tighter">Pulse<span className="text-cyan-500">CRM</span></span>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-bold uppercase tracking-widest text-cyan-500">Invoice</h2>
                  <p className="text-sm font-bold text-slate-500 mt-1">#{receipt.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Invoice From</p>
                  <h3 className="text-lg font-bold">PulseCRM Solutions</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    123 Innovation Drive<br />
                    Tech Valley, CA 94043<br />
                    United States
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Invoice To</p>
                  <h3 className="text-lg font-bold">{receipt.clientName}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {receipt.clientName.split(' ')[0]} Corp.<br />
                    Business District<br />
                    Global City
                  </p>
                </div>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="p-12">
              <div className="mb-12 grid grid-cols-3 gap-8 rounded-2xl bg-slate-50 p-6 border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Date Issued</p>
                  <p className="text-sm font-bold text-slate-900">{format(receipt.createdAt.toDate(), 'MMMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Payment Method</p>
                  <p className="text-sm font-bold text-slate-900">Credit Card (**** 4242)</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Status</p>
                  <div className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Paid in Full
                  </div>
                </div>
              </div>

              <table className="w-full mb-12">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Description</th>
                    <th className="pb-4 text-right text-xs font-bold uppercase tracking-widest text-slate-400">Qty</th>
                    <th className="pb-4 text-right text-xs font-bold uppercase tracking-widest text-slate-400">Unit Price</th>
                    <th className="pb-4 text-right text-xs font-bold uppercase tracking-widest text-slate-400">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-6">
                      <p className="font-bold text-slate-900">{receipt.description}</p>
                      <p className="text-xs text-slate-500 mt-1">Professional CRM Services & Support</p>
                    </td>
                    <td className="py-6 text-right font-medium text-slate-900">1</td>
                    <td className="py-6 text-right font-medium text-slate-900">${receipt.amount.toLocaleString()}</td>
                    <td className="py-6 text-right font-bold text-slate-900">${receipt.amount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-64 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-bold text-slate-900">${receipt.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax (0%)</span>
                    <span className="font-bold text-slate-900">$0.00</span>
                  </div>
                  <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">Total Amount</span>
                    <span className="text-2xl font-bold text-cyan-600">${receipt.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-20 pt-12 border-t border-slate-100 text-center">
                <p className="text-sm font-bold text-slate-900 mb-2">Thank you for your business!</p>
                <p className="text-xs text-slate-400">If you have any questions about this invoice, please contact support@pulsecrm.com</p>
                
                <div className="mt-8 flex justify-center gap-6 grayscale opacity-50">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                    <Building2 className="h-3 w-3" /> pulsecrm.com
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                    <Mail className="h-3 w-3" /> billing@pulsecrm.com
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                    <Phone className="h-3 w-3" /> +1 (555) 000-0000
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
