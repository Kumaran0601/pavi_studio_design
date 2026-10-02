import React, { useState } from 'react';
import {
  Clock,
  Mail,
  Phone,
  Trash2,
  Calendar,
} from 'lucide-react';
import { Button, Input, Select, Tag, Popconfirm } from 'antd';
import { toast } from 'sonner';
import { API } from '../data/constants';
import { EmptyState } from '../components/common/EmptyState';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';


const { Search } = Input;

export function AdminEnquiries({ enquiries = [], onRefresh }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const counts = {
    all: enquiries.length,
    new: enquiries.filter(e => e.status === 'new').length,
    contacted: enquiries.filter(e => e.status === 'contacted').length,
    completed: enquiries.filter(e => e.status === 'completed').length,
  };

  const filtered = enquiries.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.phone && item.phone.includes(q)) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      (item.service && item.service.toLowerCase().includes(q)) ||
      (item.message && item.message.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Status update failed');
      toast.success(`Enquiry marked as ${status}`);
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error updating status');
    }
  };

  const removeEnquiry = async id => {
    try {
      const res = await fetch(`${API}/admin/enquiries/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Enquiry deleted');
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error deleting enquiry');
    }
  };

  const renderStatusTag = status => {
    switch (status) {
      case 'new':
        return (
          <Tag color="gold" className="font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse"></span>
            New Lead
          </Tag>
        );
      case 'contacted':
        return (
          <Tag color="processing" className="font-medium px-2 py-0.5 rounded-full">
            In Discussion
          </Tag>
        );
      case 'completed':
        return (
          <Tag color="success" className="font-medium px-2 py-0.5 rounded-full">
            Completed
          </Tag>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Filter Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Mail className="text-rose-900 dark:text-rose-400" size={20} />
              Customer Inquiries & Leads
              <span className="text-xs px-2.5 py-0.5 font-sans font-semibold rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
                {filtered.length} total
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Direct consultation submissions from website visitors and prospective brides
            </p>
          </div>
          <Button onClick={onRefresh} size="small" type="default">
            Refresh List
          </Button>
        </div>

        {/* Filter Pills and Search */}
        <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            <Button
              type={filter === 'all' ? 'primary' : 'default'}
              size="middle"
              shape="round"
              onClick={() => setFilter('all')}
            >
              All Leads ({counts.all})
            </Button>
            <Button
              type={filter === 'new' ? 'primary' : 'default'}
              size="middle"
              shape="round"
              onClick={() => setFilter('new')}
            >
              New ({counts.new})
            </Button>
            <Button
              type={filter === 'contacted' ? 'primary' : 'default'}
              size="middle"
              shape="round"
              onClick={() => setFilter('contacted')}
            >
              Contacted ({counts.contacted})
            </Button>
            <Button
              type={filter === 'completed' ? 'primary' : 'default'}
              size="middle"
              shape="round"
              onClick={() => setFilter('completed')}
            >
              Completed ({counts.completed})
            </Button>
          </div>

          <div className="w-full md:w-80">
            <Search
              placeholder="Search by name, phone, service..."
              allowClear
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="middle"
            />
          </div>
        </div>
      </div>

      {/* Leads List */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(item => {
            const cleanPhone = item.phone ? item.phone.replace(/[^0-9]/g, '') : '';
            const waHref = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hello ${item.name || 'Customer'}, thank you for contacting Pavi Designer Studio regarding "${item.service || 'our services'}". How can we assist you today?`
            )}`;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Lead Information */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-serif font-bold text-slate-800 dark:text-white">
                      {item.name || 'Anonymous Customer'}
                    </span>
                    <Tag color="magenta" className="rounded-md font-medium">
                      {item.service || 'General Enquiry'}
                    </Tag>
                    {renderStatusTag(item.status)}
                  </div>

                  {/* Contact Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                      <Phone size={13} className="text-slate-400" />
                      <a href={`tel:${item.phone}`} className="hover:text-rose-900 dark:hover:text-rose-400">
                        {item.phone || 'No phone'}
                      </a>
                    </span>
                    {item.email && (
                      <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                        <Mail size={13} className="text-slate-400" />
                        <a href={`mailto:${item.email}`} className="hover:text-rose-900 dark:hover:text-rose-400">
                          {item.email}
                        </a>
                      </span>
                    )}
                    {item.createdAt && (
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Calendar size={13} />
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>

                  {/* Inquiry Message */}
                  {item.message && (
                    <div className="bg-slate-50/80 dark:bg-slate-800/60 rounded-lg p-3 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      &ldquo;{item.message}&rdquo;
                    </div>
                  )}
                </div>

                {/* Actions & Status Dropdown */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">Status:</span>
                    <Select
                      value={item.status}
                      size="middle"
                      style={{ width: 130 }}
                      onChange={val => updateStatus(item.id, val)}
                      options={[
                        { value: 'new', label: 'New Lead' },
                        { value: 'contacted', label: 'In Contact' },
                        { value: 'completed', label: 'Completed' },
                      ]}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="primary"
                      icon={<WhatsAppIcon size={15} color="#ffffff" />}
                      href={waHref}
                      target="_blank"
                      rel="noreferrer"
                      style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                      size="middle"
                    >
                      WhatsApp
                    </Button>


                    <Popconfirm
                      title="Delete customer enquiry?"
                      description="This record will be permanently deleted."
                      okText="Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => removeEnquiry(item.id)}
                    >
                      <Button
                        danger
                        icon={<Trash2 size={15} />}
                        size="middle"
                        title="Delete record"
                      />
                    </Popconfirm>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8">
          <EmptyState
            title="No customer enquiries found"
            copy="Adjust your status filter or search keywords to view leads."
          />
        </div>
      )}
    </div>
  );
}
