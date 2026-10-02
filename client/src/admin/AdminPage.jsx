import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { API } from '../data/constants';
import { useTheme } from '../context/ThemeContext';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminWorkspace } from './AdminWorkspace';

export function AdminPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/auth/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d?.data?.user) {
          setUser(d.data.user);
        } else {
          navigate('/admin/login');
        }
      })
      .catch(() => navigate('/admin/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const antTheme = {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: isDark ? '#fb7185' : '#831843',
      colorPrimaryHover: isDark ? '#fda4af' : '#9d174d',
      colorLink: isDark ? '#fda4af' : '#831843',
      colorLinkHover: isDark ? '#fecdd3' : '#9d174d',
      colorSuccess: '#16a34a',
      colorWarning: '#d97706',
      colorError: '#dc2626',
      colorInfo: isDark ? '#fb7185' : '#831843',
      borderRadius: 8,
      fontFamily: 'DM Sans, Arial, sans-serif',
      ...(isDark
        ? {
            colorBgBase: '#0b0f19',
            colorBgContainer: '#131b2e',
            colorBgElevated: '#1e293b',
            colorBgLayout: '#0b0f19',
            colorBorder: '#334155',
            colorText: '#f8fafc',
            colorTextSecondary: '#94a3b8',
          }
        : {
            colorBgBase: '#ffffff',
            colorBgContainer: '#ffffff',
            colorBgElevated: '#ffffff',
            colorBgLayout: '#f8fafc',
            colorBorder: '#e2e8f0',
            colorText: '#1e293b',
            colorTextSecondary: '#64748b',
          }),
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400 font-sans" role="status">
        <Loader2 className="animate-spin text-pink-900 dark:text-rose-400" size={28} />
        <span className="text-sm font-medium">Verifying admin session...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <ConfigProvider theme={antTheme}>
        <AdminLoginPage />
      </ConfigProvider>
    );
  }

  const logout = async () => {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
    toast.success('Signed out');
    navigate('/admin/login');
  };

  return (
    <ConfigProvider theme={antTheme}>
      <AdminWorkspace user={user} logout={logout} />
    </ConfigProvider>
  );
}
