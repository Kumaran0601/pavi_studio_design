import React from 'react';
import { Button, Tag } from 'antd';
import {
  PlusOutlined,
  MailOutlined,
  PictureOutlined,
  ScissorOutlined,
  ShoppingOutlined,
  ReadOutlined,
  WhatsAppOutlined,
  ArrowRightOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { EmptyState } from '../components/common/EmptyState';

export function AdminOverview({ data, enquiries, setSection, onRefresh }) {
  const counts = data?.counts || {};
  const recentEnquiries = enquiries?.slice(0, 5) || [];
  const newLeadsCount = enquiries.filter(e => e.status === 'new').length;

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Light Luxury / Dark Sleek Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-rose-50 via-white to-amber-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-stone-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden transition-colors">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 dark:bg-rose-950/60 text-pink-900 dark:text-rose-300 mb-2">
            Studio Control Hub
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight m-0">
            Welcome back to Pavi Studio.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
            Manage real-time customer leads, publish new embroidery works, update your service catalogue, and organize class batches.
          </p>
        </div>

        {/* Ant Design Quick Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <Button
            type="default"
            icon={<PictureOutlined />}
            onClick={() => setSection('gallery')}
            className="font-medium shadow-2xs"
          >
            Upload Photo
          </Button>

          <Button
            type="default"
            icon={<ScissorOutlined />}
            onClick={() => setSection('services')}
            className="font-medium shadow-2xs"
          >
            Add Service
          </Button>

          <Button
            type="primary"
            icon={<MailOutlined />}
            onClick={() => setSection('enquiries')}
            className="font-semibold shadow-xs"
          >
            View Leads {newLeadsCount > 0 && `(${newLeadsCount} new)`}
          </Button>
        </div>
      </div>

      {/* 5 High-Impact Metric Cards (Clean 5-Column Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Enquiries */}
        <div
          onClick={() => setSection('enquiries')}
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-lg bg-pink-50 dark:bg-pink-950/50 text-pink-900 dark:text-rose-300 border border-pink-100 dark:border-rose-900/40 grid place-items-center shrink-0 text-lg group-hover:scale-105 transition-transform">
            <MailOutlined />
          </div>
          <div className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              Total Leads
            </span>
            <strong className="block text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none mt-1">
              {counts.totalEnquiries ?? enquiries.length ?? 0}
            </strong>
          </div>
        </div>

        {/* New Leads */}
        <div
          onClick={() => setSection('enquiries')}
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40 grid place-items-center shrink-0 text-lg group-hover:scale-105 transition-transform">
            <ExclamationCircleOutlined />
          </div>
          <div className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              New Leads
            </span>
            <strong className="block text-2xl font-bold text-amber-600 dark:text-amber-400 tracking-tight leading-none mt-1">
              {newLeadsCount}
            </strong>
          </div>
        </div>

        {/* Gallery Works */}
        <div
          onClick={() => setSection('gallery')}
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40 grid place-items-center shrink-0 text-lg group-hover:scale-105 transition-transform">
            <PictureOutlined />
          </div>
          <div className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              Gallery Works
            </span>
            <strong className="block text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none mt-1">
              {counts.gallery ?? data?.gallery?.length ?? 0}
            </strong>
          </div>
        </div>

        {/* Active Services */}
        <div
          onClick={() => setSection('services')}
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900/40 grid place-items-center shrink-0 text-lg group-hover:scale-105 transition-transform">
            <ScissorOutlined />
          </div>
          <div className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              Services
            </span>
            <strong className="block text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none mt-1">
              {counts.services ?? data?.services?.length ?? 0}
            </strong>
          </div>
        </div>

        {/* Aari Materials */}
        <div
          onClick={() => setSection('materials')}
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex items-center gap-3.5 group col-span-2 sm:col-span-1"
        >
          <div className="w-11 h-11 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 grid place-items-center shrink-0 text-lg group-hover:scale-105 transition-transform">
            <ShoppingOutlined />
          </div>
          <div className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              Materials
            </span>
            <strong className="block text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none mt-1">
              {counts.materials ?? data?.materials?.length ?? 0}
            </strong>
          </div>
        </div>
      </div>

      {/* Two Column Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customer Inquiries Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white m-0 flex items-center gap-2">
                  <MailOutlined className="text-pink-900 dark:text-rose-400" /> Recent Customer Leads
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Latest website requests requiring follow-up</span>
              </div>
              <Button
                size="small"
                onClick={() => setSection('enquiries')}
                className="font-medium"
              >
                View All ({enquiries.length})
              </Button>
            </div>

            {recentEnquiries.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {recentEnquiries.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs grid place-items-center shrink-0">
                        {item.name ? item.name[0].toUpperCase() : 'C'}
                      </div>
                      <div className="min-w-0">
                        <strong className="block text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </strong>
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {item.service || 'Enquiry'} · {item.phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Tag
                        color={
                          item.status === 'new'
                            ? 'error'
                            : item.status === 'contacted'
                            ? 'processing'
                            : 'success'
                        }
                        className="!m-0 text-[10px] uppercase font-bold"
                      >
                        {item.status}
                      </Tag>

                      <Button
                        type="primary"
                        size="small"
                        icon={<WhatsAppOutlined />}
                        href={`https://wa.me/${item.phone ? item.phone.replace(/[^0-9]/g, '') : ''}`}
                        target="_blank"
                        rel="noreferrer"
                        className="!bg-emerald-600 hover:!bg-emerald-700 border-none shadow-xs text-xs font-medium"
                      >
                        Chat
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No customer enquiries yet" copy="New enquiries will appear here automatically." />
            )}
          </div>
        </div>

        {/* Studio Catalogue Snapshot */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white m-0 flex items-center gap-2">
                  <PictureOutlined className="text-pink-900 dark:text-rose-400" /> Studio Catalogue Snapshot
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Live published content across studio categories</span>
              </div>
              <Button
                size="small"
                onClick={() => setSection('gallery')}
                className="font-medium"
              >
                Manage Portfolio
              </Button>
            </div>

            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div
                onClick={() => setSection('gallery')}
                className="py-3 flex items-center justify-between cursor-pointer hover:text-pink-900 dark:hover:text-rose-400 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Bridal & Blouse Works</span>
                </div>
                <strong className="text-slate-900 dark:text-white font-semibold font-mono">
                  {data?.gallery?.filter(g => g.category?.toLowerCase().includes('bridal') || g.category?.toLowerCase().includes('blouse')).length || 0} items
                </strong>
              </div>

              <div
                onClick={() => setSection('gallery')}
                className="py-3 flex items-center justify-between cursor-pointer hover:text-pink-900 dark:hover:text-rose-400 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Aari Embroidery & Custom Work</span>
                </div>
                <strong className="text-slate-900 dark:text-white font-semibold font-mono">
                  {data?.gallery?.filter(g => g.category?.toLowerCase().includes('aari') || g.category?.toLowerCase().includes('custom')).length || 0} items
                </strong>
              </div>

              <div
                onClick={() => setSection('services')}
                className="py-3 flex items-center justify-between cursor-pointer hover:text-pink-900 dark:hover:text-rose-400 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Studio Services Published</span>
                </div>
                <strong className="text-slate-900 dark:text-white font-semibold font-mono">
                  {data?.services?.length || 0} services
                </strong>
              </div>

              <div
                onClick={() => setSection('materials')}
                className="py-3 flex items-center justify-between cursor-pointer hover:text-pink-900 dark:hover:text-rose-400 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Materials In Catalogue</span>
                </div>
                <strong className="text-slate-900 dark:text-white font-semibold font-mono">
                  {data?.materials?.length || 0} items
                </strong>
              </div>

              <div
                onClick={() => setSection('course')}
                className="py-3 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">1-Month Aari Classes</span>
                </div>
                <Tag color="success" className="!m-0 text-[10px] font-bold uppercase">
                  Active & Enrolling
                </Tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
