'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { HeartPulse, Mail, Lock, User, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const { setRole } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('parent');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              role: selectedRole
            }
          }
        });
        if (error) throw error;
      }

      setRole(selectedRole);
      if (selectedRole === 'doctor') {
        router.push('/doctor');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
              <HeartPulse className="w-7 h-7" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Create MediHero Account
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Empowering adherence and courage for your family or clinical practice
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            I am joining as a:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole('parent')}
              className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                selectedRole === 'parent'
                  ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="block font-black text-sm">Parent / Family</span>
              <span className="text-[10px] opacity-80">Caregiver for child or elder</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('doctor')}
              className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                selectedRole === 'doctor'
                  ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="block font-black text-sm">Doctor / Clinician</span>
              <span className="text-[10px] opacity-80">Oncologist or Geriatrician</span>
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="Sarah Miller"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
              />
            </div>
          </div>

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
              Password (Min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                minLength={6}
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
            <UserCheck className="w-4 h-4" />
            <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-teal-600 hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
