import React, { useState } from 'react';
import {
  Check,
  Pencil,
  Plus,
  Scissors,
  Trash2,
  X,
  Sparkles,
} from 'lucide-react';
import {
  Button,
  Modal,
  Input,
  Tag,
  Popconfirm,
  Switch,
} from 'antd';
import { toast } from 'sonner';
import { API, defaultDetailImage } from '../data/constants';
import { EmptyState } from '../components/common/EmptyState';

const { Search, TextArea } = Input;

export function ServicesManager({ items = [], onRefresh }) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [editingService, setEditingService] = useState(null);

  // New service draft
  const [newDraft, setNewDraft] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    longDescription: '',
    ctaLabel: 'Enquire About This Work',
    sortOrder: items.length + 1,
    imageUrl: '/images/bridal-blouse_3987d927.jpg',
  });
  const [addBusy, setAddBusy] = useState(false);

  const handleAddService = async e => {
    e.preventDefault();
    if (!newDraft.title || !newDraft.shortDescription) {
      return toast.error('Please enter a service title and short description.');
    }

    setAddBusy(true);
    try {
      const slug =
        newDraft.slug ||
        newDraft.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const res = await fetch(`${API}/admin/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...newDraft,
          slug,
          sortOrder: Number(newDraft.sortOrder) || 0,
          isActive: 1,
        }),
      });

      if (!res.ok) throw new Error('Failed to create service.');

      toast.success('Service created successfully!');
      setNewDraft({
        title: '',
        slug: '',
        shortDescription: '',
        longDescription: '',
        ctaLabel: 'Enquire About This Work',
        sortOrder: items.length + 2,
        imageUrl: '/images/bridal-blouse_3987d927.jpg',
      });
      setShowAdd(false);
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error adding service');
    } finally {
      setAddBusy(false);
    }
  };

  const toggleStatus = async (item, checked) => {
    try {
      const nextStatus = checked ? 1 : 0;
      const res = await fetch(`${API}/admin/services/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: nextStatus }),
      });
      if (!res.ok) throw new Error('Status update failed');
      toast.success(`Service marked as ${nextStatus ? 'Active' : 'Inactive'}`);
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error updating service status');
    }
  };

  const removeService = async item => {
    try {
      const res = await fetch(`${API}/admin/services/${item.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Service record deleted.');
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error deleting service');
    }
  };

  const filtered = items.filter(s => {
    const matchesActive =
      filterActive === 'all' ||
      (filterActive === 'active' && s.isActive) ||
      (filterActive === 'inactive' && !s.isActive);
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (s.title && s.title.toLowerCase().includes(q)) ||
      (s.slug && s.slug.toLowerCase().includes(q)) ||
      (s.shortDescription && s.shortDescription.toLowerCase().includes(q));
    return matchesActive && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header and Toolbar Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Scissors className="text-rose-900 dark:text-rose-400" size={20} />
              Signature Studio Services
              <span className="text-xs px-2.5 py-0.5 font-sans font-semibold rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
                {filtered.length} offerings
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage custom bridal blouse designs, hand embroidery packages, and service landing pages
            </p>
          </div>

          <Button
            type="primary"
            icon={showAdd ? <X size={15} /> : <Plus size={15} />}
            onClick={() => setShowAdd(!showAdd)}
            size="middle"
          >
            {showAdd ? 'Close' : 'Add New Service'}
          </Button>
        </div>

        {/* Collapsible Add Service Form */}
        {showAdd && (
          <form
            onSubmit={handleAddService}
            className="my-5 p-5 bg-slate-50/70 dark:bg-slate-800/60 border border-rose-100 dark:border-slate-700 rounded-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-semibold text-rose-950 dark:text-rose-300 text-base flex items-center gap-2">
                <Sparkles size={16} className="text-rose-900 dark:text-rose-400" />
                Create New Studio Service
              </h4>
              <span className="text-xs text-slate-400">Generates custom detail page URL</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Service Title <span className="text-rose-600 dark:text-rose-400">*</span>
                </label>
                <Input
                  placeholder="e.g. Zardosi Bridal Embellishment"
                  value={newDraft.title}
                  onChange={e => setNewDraft({ ...newDraft, title: e.target.value })}
                  required
                  size="middle"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL Slug <span className="text-slate-400 font-normal">(Auto-generated if empty)</span>
                </label>
                <Input
                  placeholder="e.g. zardosi-bridal-embellishment"
                  value={newDraft.slug}
                  onChange={e => setNewDraft({ ...newDraft, slug: e.target.value })}
                  size="middle"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Description <span className="text-rose-600 dark:text-rose-400">*</span>{' '}
                  <span className="text-slate-400 font-normal">(Appears on home page cards)</span>
                </label>
                <Input
                  placeholder="Brief summary of the embroidery work"
                  value={newDraft.shortDescription}
                  onChange={e => setNewDraft({ ...newDraft, shortDescription: e.target.value })}
                  required
                  size="middle"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Long Description{' '}
                  <span className="text-slate-400 font-normal">(Shown on dedicated service page)</span>
                </label>
                <TextArea
                  rows={3}
                  placeholder="Elaborate details about materials, process, styling, and customization..."
                  value={newDraft.longDescription}
                  onChange={e => setNewDraft({ ...newDraft, longDescription: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  CTA Button Label
                </label>
                <Input
                  value={newDraft.ctaLabel}
                  onChange={e => setNewDraft({ ...newDraft, ctaLabel: e.target.value })}
                  size="middle"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sort Order Index
                </label>
                <Input
                  type="number"
                  value={newDraft.sortOrder}
                  onChange={e => setNewDraft({ ...newDraft, sortOrder: e.target.value })}
                  size="middle"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Service Image URL
                </label>
                <Input
                  value={newDraft.imageUrl}
                  onChange={e => setNewDraft({ ...newDraft, imageUrl: e.target.value })}
                  size="middle"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button onClick={() => setShowAdd(false)} size="middle">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={addBusy}
                icon={<Plus size={14} />}
                size="middle"
              >
                {addBusy ? 'Saving...' : 'Add Service'}
              </Button>
            </div>
          </form>
        )}

        {/* Toolbar: Status filter and Search */}
        <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            <Button
              type={filterActive === 'all' ? 'primary' : 'default'}
              size="middle"
              shape="round"
              onClick={() => setFilterActive('all')}
            >
              All ({items.length})
            </Button>
            <Button
              type={filterActive === 'active' ? 'primary' : 'default'}
              size="middle"
              shape="round"
              onClick={() => setFilterActive('active')}
            >
              Active ({items.filter(s => s.isActive).length})
            </Button>
            <Button
              type={filterActive === 'inactive' ? 'primary' : 'default'}
              size="middle"
              shape="round"
              onClick={() => setFilterActive('inactive')}
            >
              Inactive ({items.filter(s => !s.isActive).length})
            </Button>
          </div>

          <div className="w-full md:w-80">
            <Search
              placeholder="Search by title or description..."
              allowClear
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="middle"
            />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(service => (
            <div
              key={service.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Media Image */}
                <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={service.imageUrl || defaultDetailImage}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Tag color="default" className="bg-white/90 dark:bg-slate-900/90 dark:text-slate-200 backdrop-blur-xs font-semibold text-xs border-0">
                      Order #{service.sortOrder || 1}
                    </Tag>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Tag
                      color={service.isActive ? 'success' : 'default'}
                      className="font-bold text-[10px] uppercase rounded-full shadow-xs"
                    >
                      {service.isActive ? 'Active' : 'Inactive'}
                    </Tag>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-serif font-bold text-slate-800 dark:text-white text-base line-clamp-1">
                      {service.title}
                    </h4>
                  </div>

                  <span className="text-[11px] font-mono text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md inline-block">
                    /{service.slug}
                  </span>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  <div className="text-[11px] text-slate-400">
                    Button: &ldquo;{service.ctaLabel || 'Explore'}&rdquo;
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 flex items-center justify-between">
                <Button
                  size="small"
                  icon={<Pencil size={13} />}
                  onClick={() => setEditingService(service)}
                >
                  Edit
                </Button>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-medium">Active:</span>
                    <Switch
                      size="small"
                      checked={Boolean(service.isActive)}
                      onChange={checked => toggleStatus(service, checked)}
                    />
                  </div>

                  <Popconfirm
                    title="Delete service?"
                    description={`Permanently remove "${service.title}"?`}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => removeService(service)}
                  >
                    <Button
                      size="small"
                      danger
                      icon={<Trash2 size={13} />}
                      title="Delete service"
                    />
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8">
          <EmptyState
            title="No services match your criteria"
            copy="Try adjusting your search query or create a new service."
          />
        </div>
      )}

      {/* ANT DESIGN MODAL: ISOLATED SERVICE EDIT */}
      {editingService && (
        <ServiceEditModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onSuccess={() => {
            setEditingService(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

export function ServiceEditModal({ service, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: service.title || '',
    slug: service.slug || '',
    shortDescription: service.shortDescription || '',
    longDescription: service.longDescription || '',
    imageUrl: service.imageUrl || '',
    ctaLabel: service.ctaLabel || 'Enquire',
    sortOrder: service.sortOrder || 0,
    isActive: Boolean(service.isActive),
  });
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!form.title || !form.shortDescription) {
      return toast.error('Title and short description are required.');
    }
    setBusy(true);
    try {
      const res = await fetch(`${API}/admin/services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          sortOrder: Number(form.sortOrder) || 0,
          isActive: form.isActive ? 1 : 0,
        }),
      });

      if (!res.ok) throw new Error('Could not update service.');
      toast.success('Service updated successfully!');
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={true}
      onCancel={onClose}
      title={
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 font-serif text-base text-slate-800 dark:text-white">
          <Scissors size={17} className="text-rose-900 dark:text-rose-400" />
          Edit Service: {service.title}
        </div>
      }
      footer={[
        <Button key="cancel" onClick={onClose} disabled={busy}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={busy}
          icon={<Check size={14} />}
          onClick={save}
        >
          Save Service Changes
        </Button>,
      ]}
      destroyOnClose
      centered
      width={680}
    >
      <div className="py-3 space-y-4">
        {/* Banner Preview */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl">
          <img
            src={form.imageUrl || service.imageUrl || defaultDetailImage}
            alt=""
            className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
          />
          <div>
            <strong className="text-sm text-slate-800 dark:text-white block font-serif">Editing Service #{service.id}</strong>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Modifications immediately update the homepage card and dedicated landing page
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Service Title <span className="text-rose-600 dark:text-rose-400">*</span>
            </label>
            <Input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
              size="middle"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              URL Slug <span className="text-rose-600 dark:text-rose-400">*</span>
            </label>
            <Input
              value={form.slug}
              onChange={e => setForm({ ...form, slug: e.target.value })}
              required
              size="middle"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Short Description <span className="text-rose-600 dark:text-rose-400">*</span>
          </label>
          <Input
            value={form.shortDescription}
            onChange={e => setForm({ ...form, shortDescription: e.target.value })}
            required
            size="middle"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Long Description (Detailed Overview)
          </label>
          <TextArea
            rows={3}
            value={form.longDescription}
            onChange={e => setForm({ ...form, longDescription: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              CTA Button Label
            </label>
            <Input
              value={form.ctaLabel}
              onChange={e => setForm({ ...form, ctaLabel: e.target.value })}
              size="middle"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Sort Order Index
            </label>
            <Input
              type="number"
              value={form.sortOrder}
              onChange={e => setForm({ ...form, sortOrder: e.target.value })}
              size="middle"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
          <Input
            value={form.imageUrl}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            size="middle"
          />
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Switch
            checked={form.isActive}
            onChange={checked => setForm({ ...form, isActive: checked })}
          />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Service is active & visible on public website
          </span>
        </div>
      </div>
    </Modal>
  );
}
