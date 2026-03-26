import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './hooks/useAuth';
import { AuthGuard } from './components/auth/AuthGuard';
import { LoginForm } from './components/auth/LoginForm';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Employees } from './pages/Employees';
import { Receipts } from './pages/Receipts';
import { Tasks } from './pages/Tasks';
import { Logs } from './pages/Logs';

const PulseHub = lazy(() => import('./pages/PulseHub'));
const Events = lazy(() => import('./pages/Events'));
const ReceiptDetail = lazy(() => import('./pages/ReceiptDetail'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          
          <Route path="/" element={
            <AuthGuard>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </AuthGuard>
          } />

          <Route path="/pulsehub" element={
            <AuthGuard>
              <DashboardLayout>
                <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#0f172a]"><div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" /></div>}>
                  <PulseHub />
                </Suspense>
              </DashboardLayout>
            </AuthGuard>
          } />

          <Route path="/events" element={
            <AuthGuard>
              <DashboardLayout>
                <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#0f172a]"><div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" /></div>}>
                  <Events />
                </Suspense>
              </DashboardLayout>
            </AuthGuard>
          } />

          <Route path="/clients" element={
            <AuthGuard roles={['admin', 'employee']}>
              <DashboardLayout>
                <Clients />
              </DashboardLayout>
            </AuthGuard>
          } />

          <Route path="/employees" element={
            <AuthGuard roles={['admin']}>
              <DashboardLayout>
                <Employees />
              </DashboardLayout>
            </AuthGuard>
          } />

          <Route path="/receipts" element={
            <AuthGuard roles={['admin', 'employee', 'client']}>
              <DashboardLayout>
                <Receipts />
              </DashboardLayout>
            </AuthGuard>
          } />

          <Route path="/receipts/:id" element={
            <AuthGuard roles={['admin', 'employee', 'client']}>
              <DashboardLayout>
                <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#0f172a]"><div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" /></div>}>
                  <ReceiptDetail />
                </Suspense>
              </DashboardLayout>
            </AuthGuard>
          } />

          <Route path="/tasks" element={
            <AuthGuard roles={['admin', 'employee', 'client']}>
              <DashboardLayout>
                <Tasks />
              </DashboardLayout>
            </AuthGuard>
          } />

          <Route path="/logs" element={
            <AuthGuard roles={['admin']}>
              <DashboardLayout>
                <Logs />
              </DashboardLayout>
            </AuthGuard>
          } />

          <Route path="/unauthorized" element={
            <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-rose-500">403</h1>
                <p className="mt-2 text-slate-400">Unauthorized Access</p>
                <a href="/" className="mt-4 inline-block text-cyan-500 hover:underline">Back to Dashboard</a>
              </div>
            </div>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
