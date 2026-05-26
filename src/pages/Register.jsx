import React, { useState } from 'react';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';

function Register({ onRegister, switchToLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields to create your account.');
      return;
    }

    const result = onRegister({ fullName, email, password });
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-[2rem] border border-outline-variant shadow-2xl p-7 sm:p-10">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary grid place-items-center">
            <User className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="text-sm text-on-surface-variant mt-2">Start your Kaizen journey and get access to your dashboard.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">Full name</label>
            <div className="flex items-center gap-3 bg-slate-50 border border-outline-variant rounded-2xl px-3 py-2">
              <User className="w-4 h-4 text-on-surface-variant" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-transparent outline-none text-sm text-on-surface"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">Work email</label>
            <div className="flex items-center gap-3 bg-slate-50 border border-outline-variant rounded-2xl px-3 py-2">
              <Mail className="w-4 h-4 text-on-surface-variant" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-transparent outline-none text-sm text-on-surface"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">Password</label>
            <div className="flex items-center gap-3 bg-slate-50 border border-outline-variant rounded-2xl px-3 py-2">
              <Lock className="w-4 h-4 text-on-surface-variant" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="w-full bg-transparent outline-none text-sm text-on-surface"
              />
            </div>
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-on-primary rounded-2xl text-sm font-bold shadow-sm hover:bg-primary-container transition-colors">
            <span>Create Account</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-on-surface-variant">
          Already have an account?{' '}
          <button onClick={switchToLogin} className="font-bold text-primary hover:text-primary-container transition-colors">
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
