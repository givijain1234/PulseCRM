import { useState } from 'react';
import { Activity, ShieldCheck, User as UserIcon, Briefcase, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Navigate, useLocation } from 'react-router-dom';
import { Role } from '../../types';
import { cn } from '../../lib/utils';

export function LoginForm() {
  const { signIn, user, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>('client');
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (loading) return null;
  if (user) return <Navigate to={from} replace />;

  const roles: { id: Role; label: string; icon: any; description: string }[] = [
    { id: 'admin', label: 'Admin', icon: Shield, description: 'Full system access' },
    { id: 'employee', label: 'Employee', icon: Briefcase, description: 'Manage assigned clients' },
    { id: 'client', label: 'Client', icon: UserIcon, description: 'View your progress' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <Card className="relative w-full max-w-md border-slate-800/50 bg-slate-900/40 backdrop-blur-2xl">
        <CardHeader className="flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <Activity className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Pulse<span className="text-cyan-500">CRM</span>
          </CardTitle>
          <CardDescription className="mt-2 text-slate-400">
            Select your role to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={cn(
                  "flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200",
                  selectedRole === role.id
                    ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                    : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                )}
              >
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  selectedRole === role.id ? "bg-cyan-500 text-white" : "bg-slate-800 text-slate-400"
                )}>
                  <role.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className={cn("font-bold", selectedRole === role.id ? "text-white" : "text-slate-300")}>
                    {role.label}
                  </p>
                  <p className="text-xs text-slate-500">{role.description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => signIn(selectedRole)} 
              className="w-full h-12 gap-3 text-lg font-semibold"
            >
              <img src="https://www.google.com/favicon.ico" className="h-5 w-5" alt="Google" />
              Sign in with Google
            </Button>
            <p className="text-center text-xs text-slate-500">
              Access your dashboard with secure Google Authentication
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-slate-800/30 p-4 border border-slate-800/50">
            <ShieldCheck className="h-5 w-5 text-cyan-500" />
            <p className="text-xs text-slate-400">
              Your data is protected with enterprise-grade security and role-based access control.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
