import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Alert, ConfigProvider, theme as antdTheme } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { toast } from 'sonner';
import { API } from '../data/constants';
import { usePageMeta } from '../hooks/usePageMeta';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/common/ThemeToggle';

export function AdminLoginPage() {
  usePageMeta('Studio Admin Login | Pavi Designer Studio', 'Secure administrative workspace for Pavi Designer Studio.', '/admin/login');
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const antTheme = {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: isDark ? '#fb7185' : '#831843',
      colorPrimaryHover: isDark ? '#fda4af' : '#9d174d',
      colorLink: isDark ? '#fb7185' : '#831843',
      borderRadius: 8,
      fontFamily: 'DM Sans, Arial, sans-serif',
      ...(isDark
        ? {
            colorBgBase: '#0b0f19',
            colorBgContainer: '#131b2e',
            colorBgElevated: '#1e293b',
            colorBorder: '#334155',
            colorText: '#f8fafc',
            colorTextSecondary: '#94a3b8',
          }
        : {
            colorBgBase: '#ffffff',
            colorBgContainer: '#ffffff',
            colorBorder: '#e2e8f0',
            colorText: '#1e293b',
          }),
    },
  };

  const submit = async event => {
    event?.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'Login failed.');
      }
      toast.success('Welcome back, Administrator!');
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please verify username and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider theme={antTheme}>
      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-rose-50/60 via-slate-50 to-amber-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-stone-950 font-sans relative overflow-hidden transition-colors duration-200">
        {/* Theme Toggle in Top Corner */}
        <div className="absolute top-5 right-5 z-20">
          <ThemeToggle />
        </div>

        {/* Subtle light/dark ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-pink-200/30 to-amber-200/20 dark:from-pink-900/20 dark:to-amber-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* Main Card */}
        <div className="relative z-10 w-full max-w-[430px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/70 dark:shadow-black/50 border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 text-center animate-fade-in transition-colors duration-200">
          {/* Studio Branding */}
          <Link to="/" className="inline-flex items-center gap-3 mb-5 hover:opacity-90 transition-opacity">
            <span
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-900 via-rose-900 to-rose-950 font-serif font-bold text-2xl grid place-items-center shadow-md border border-amber-400/60 leading-none select-none"
              style={{ color: '#fbbf24', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
            >
              P
            </span>
            <span className="text-left">
              <strong className="block text-xl font-serif tracking-tight text-slate-900 dark:text-white leading-none">
                Pavi
              </strong>
              <em className="text-[10px] tracking-widest uppercase not-italic text-amber-700 dark:text-amber-400 font-semibold">
                Designer Studio
              </em>
            </span>
          </Link>

          {/* Header Copy */}
          <div className="mb-6">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-pink-900 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/50 mb-2">
              Owner Workspace
            </span>
            <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white tracking-tight m-0">
              Admin Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              Sign in to manage studio leads, embroidery portfolio, services, and course batches.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 text-left">
              <Alert message={error} type="error" showIcon closable onClose={() => setError('')} />
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={submit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <Input
                prefix={<UserOutlined className="text-slate-400 mr-1" />}
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                size="large"
                required
                autoFocus
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Default: admin123</span>
              </div>
              <Input.Password
                prefix={<LockOutlined className="text-slate-400 mr-1" />}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="admin123"
                size="large"
                required
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<LoginOutlined />}
              size="large"
              block
              className="mt-2 font-semibold shadow-md shadow-pink-900/10 cursor-pointer h-11"
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            </Button>
          </form>

          {/* Demo Credentials Chip */}
          <div className="mt-6 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span className="font-medium">Demo Access:</span>
            <code className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono text-pink-950 dark:text-rose-300 font-semibold">
              admin / admin123
            </code>
          </div>

          {/* Return Link */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-pink-900 dark:hover:text-rose-400 transition-colors"
            >
              <ArrowLeftOutlined /> Return to Studio Website
            </Link>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
