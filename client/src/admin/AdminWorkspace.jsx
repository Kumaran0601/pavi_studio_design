import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AppstoreOutlined,
  BookOutlined,
  CheckCircleFilled,
  ExportOutlined,
  LogoutOutlined,
  MailOutlined,
  MenuOutlined,
  PictureOutlined,
  ReloadOutlined,
  ScissorOutlined,
  SettingOutlined,
  SkinOutlined,
} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { toast } from 'sonner';
import { API } from '../data/constants';
import { PageLoading } from '../components/common/PageLoading';
import { ThemeToggle } from '../components/common/ThemeToggle';

// Modular Sub-Managers
import { AdminOverview } from './AdminOverview';
import { AdminEnquiries } from './AdminEnquiries';
import { GalleryManager } from './GalleryManager';
import { ServicesManager } from './ServicesManager';
import { MaterialsManager } from './MaterialsManager';
import { CourseManager } from './CourseManager';
import { SettingsManager } from './SettingsManager';

export function AdminWorkspace({ user, logout }) {
  const [section, setSection] = useState('overview');
  const [data, setData] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API}/admin/dashboard`, { credentials: 'include' });
      const json = await res.json();
      if (json.data) setData(json.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load dashboard data');
    }
  };

  const fetchEnquiries = async () => {
    try {
      const res = await fetch(`${API}/admin/enquiries`, { credentials: 'include' });
      const json = await res.json();
      if (Array.isArray(json.data)) setEnquiries(json.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load enquiries');
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchDashboard(), fetchEnquiries()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const counts = data?.counts || {};
  const newEnquiriesCount = enquiries.filter(e => e.status === 'new').length;

  const nav = [
    { key: 'overview', icon: AppstoreOutlined, label: 'Overview' },
    {
      key: 'enquiries',
      icon: MailOutlined,
      label: 'Customer Leads',
      badge: newEnquiriesCount > 0 ? newEnquiriesCount : null,
      isAlert: newEnquiriesCount > 0,
    },
    {
      key: 'gallery',
      icon: PictureOutlined,
      label: 'Portfolio Works',
      badge: counts.gallery ?? null,
    },
    {
      key: 'services',
      icon: ScissorOutlined,
      label: 'Services Catalogue',
      badge: counts.services ?? null,
    },
    {
      key: 'materials',
      icon: SkinOutlined,
      label: 'Aari Materials',
      badge: counts.materials ?? null,
    },
    { key: 'course', icon: BookOutlined, label: 'Classes & Training' },
    { key: 'settings', icon: SettingOutlined, label: 'Studio Settings' },
  ];

  const currentNav = nav.find(item => item.key === section);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr] bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Light Clean Executive Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-[260px] bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 z-50 flex flex-col p-5 shadow-sm transition-transform duration-200 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-800 mb-5">
          <Link
            to="/"
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-900 via-rose-900 to-rose-950 grid place-items-center border border-amber-400/60 shadow-md transition-transform hover:scale-105"
            style={{ textDecoration: 'none' }}
            title="Pavi Designer Studio"
          >
            <span
              className="font-serif font-bold text-2xl select-none leading-none"
              style={{ color: '#fbbf24', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
            >
              P
            </span>
          </Link>
          <div>
            <strong className="block font-serif text-lg font-bold text-slate-900 dark:text-white leading-none">
              Pavi Studio
            </strong>
            <em className="block text-[9.5px] uppercase tracking-wider not-italic text-amber-700 dark:text-amber-400 font-semibold mt-1">
              Admin Workspace
            </em>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1">
          {nav.map(item => {
            const Icon = item.icon;
            const isActive = section === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setSection(item.key);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all text-left cursor-pointer border ${
                  isActive
                    ? 'bg-rose-50/90 dark:bg-rose-950/40 text-pink-900 dark:text-rose-300 border-rose-200/80 dark:border-rose-900/50 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`text-base ${
                      isActive ? 'text-pink-900 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`inline-flex items-center justify-center text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] ${
                      item.isAlert
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer: User & Sign Out */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-900 dark:text-rose-300 font-bold text-xs grid place-items-center border border-pink-200 dark:border-rose-900/60 shrink-0">
              {(user.name || user.username || 'A')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user.name || user.username}
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Administrator
              </span>
            </div>
          </div>

          <Tooltip title="Sign Out">
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={logout}
              size="small"
              className="text-slate-400 hover:text-rose-600"
            />
          </Tooltip>
        </div>
      </aside>

      {/* Main Workspace Body */}
      <main className="min-w-0 flex flex-col">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-5 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 md:hidden hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Open menu"
            >
              <MenuOutlined />
            </button>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-900 dark:text-rose-400 block">
                Studio Management
              </span>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white m-0 leading-tight">
                {currentNav?.label || 'Overview'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* Ant Design Buttons */}
            <Button
              icon={<ReloadOutlined className={loading ? 'animate-spin' : ''} />}
              onClick={refreshAll}
              loading={loading}
              className="font-medium"
            >
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              type="primary"
              icon={<ExportOutlined />}
              href="/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold shadow-xs"
            >
              <span className="hidden sm:inline">View Studio Site</span>
            </Button>
          </div>
        </header>

        {/* Content View Container */}
        <div className="p-5 sm:p-8 max-w-7xl w-full mx-auto flex-1">
          {loading && !data ? (
            <PageLoading />
          ) : section === 'overview' ? (
            <AdminOverview
              data={data}
              enquiries={enquiries}
              setSection={setSection}
              onRefresh={refreshAll}
            />
          ) : section === 'enquiries' ? (
            <AdminEnquiries enquiries={enquiries} onRefresh={refreshAll} />
          ) : section === 'gallery' ? (
            <GalleryManager items={data?.gallery || []} onRefresh={refreshAll} />
          ) : section === 'services' ? (
            <ServicesManager items={data?.services || []} onRefresh={refreshAll} />
          ) : section === 'materials' ? (
            <MaterialsManager items={data?.materials || []} onRefresh={refreshAll} />
          ) : section === 'course' ? (
            <CourseManager course={data?.course} onRefresh={refreshAll} />
          ) : (
            <SettingsManager settings={data?.settings} onRefresh={refreshAll} />
          )}
        </div>
      </main>
    </div>
  );
}
