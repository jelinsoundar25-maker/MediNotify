'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { HeartPulse, Mail, Lock, LogIn, ArrowRight, ShieldCheck, Users, Stethoscope } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const { setRole, setActivePatientId } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      }
      
      // Route based on role
      if (email.includes('doctor')) {
        setRole('doctor');
        router.push('/doctor');
      } else {
        setRole('parent');
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick One-Click Demo logins
  const handleQuickLogin = (roleType: 'parent' | 'doctor' | 'elderly') => {
    setRole(roleType);
    if (roleType === 'doctor') {
      router.push('/doctor');
    } else if (roleType === 'elderly') {
      setActivePatientId('pat-arthur-002');
      router.push('/patient/elderly');
    } else {
      setActivePatientId('pat-leo-001');
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
              <HeartPulse className="w-7 h-7" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome to MediHero
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to manage medications, adherence, and companion modes
          </p>
        </div>

        {/* Quick Demo Access Buttons */}
        <div className="mb-6 p-3.5 bg-teal-50/80 rounded-2xl border border-teal-100">
          <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wide mb-2 text-center">
            ⚡ Quick Demo Logins (No signup needed)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('parent')}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-teal-100/70 border border-teal-200 text-teal-900 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-teal-600" />
              <span>Parent Portal</span>
            </button>
            <button
              onClick={() => handleQuickLogin('doctor')}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-blue-100/70 border border-blue-200 text-blue-900 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
              <span>Doctor Portal</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="sarah.miller@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Don’t have an account yet?{' '}
            <Link href="/register" className="font-bold text-teal-600 hover:underline">
              Create New Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
