import React, { useState } from 'react';
import {
  Check,
  Gem,
  Pencil,
  Plus,
  Trash2,
  X,
  Package,
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

const { Search } = Input;

export function MaterialsManager({ items = [], onRefresh }) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingMaterial, setEditingMaterial] = useState(null);

  const [newDraft, setNewDraft] = useState({
    name: '',
    category: 'Basic Aari Materials',
    slug: '',
    shortDescription: '',
    whatsappLabel: 'Ask about materials',
    sortOrder: items.length + 1,
    imageUrl: defaultDetailImage,
  });
  const [addBusy, setAddBusy] = useState(false);

  const categories = ['All', 'Basic Aari Materials', 'Needles', 'Threads', 'Beads', 'Embroidery Accessories'];

  const handleAddMaterial = async e => {
    e.preventDefault();
    if (!newDraft.name || !newDraft.shortDescription) {
      return toast.error('Please enter material name and description.');
    }

    setAddBusy(true);
    try {
      const slug =
        newDraft.slug ||
        newDraft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const res = await fetch(`${API}/admin/materials`, {
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

      if (!res.ok) throw new Error('Failed to create material record.');

      toast.success('Material added to catalogue!');
      setNewDraft({
        name: '',
        category: 'Basic Aari Materials',
        slug: '',
        shortDescription: '',
        whatsappLabel: 'Ask about materials',
        sortOrder: items.length + 2,
        imageUrl: defaultDetailImage,
      });
      setShowAdd(false);
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error adding material');
    } finally {
      setAddBusy(false);
    }
  };

  const toggleStatus = async (item, checked) => {
    try {
      const nextStatus = checked ? 1 : 0;
      const res = await fetch(`${API}/admin/materials/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: nextStatus }),
      });
      if (!res.ok) throw new Error('Status update failed');
      toast.success(`Material marked as ${nextStatus ? 'Active' : 'Inactive'}`);
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error updating status');
    }
  };

  const removeMaterial = async item => {
    try {
      const res = await fetch(`${API}/admin/materials/${item.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Material deleted.');
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error deleting material');
    }
  };

  const filtered = items.filter(m => {
    const matchesCat = categoryFilter === 'All' || m.category === categoryFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      (m.category && m.category.toLowerCase().includes(q)) ||
      (m.shortDescription && m.shortDescription.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header and Toolbar Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Gem className="text-rose-900 dark:text-rose-400" size={20} />
              Aari Materials Catalogue
              <span className="text-xs px-2.5 py-0.5 font-sans font-semibold rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
                {filtered.length} products
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage student kits, needles, French metallic zari threads, and bead embellishments
            </p>
          </div>

          <Button
            type="primary"
            icon={showAdd ? <X size={15} /> : <Plus size={15} />}
            onClick={() => setShowAdd(!showAdd)}
            size="middle"
          >
            {showAdd ? 'Close' : 'Add New Material'}
          </Button>
        </div>

        {/* Collapsible Add Material Form */}
        {showAdd && (
          <form
            onSubmit={handleAddMaterial}
            className="my-5 p-5 bg-slate-50/70 dark:bg-slate-800/60 border border-rose-100 dark:border-slate-700 rounded-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-semibold text-rose-950 dark:text-rose-300 text-base flex items-center gap-2">
                <Package size={16} className="text-rose-900 dark:text-rose-400" />
                Add New Material to Studio Stock
              </h4>
              <span className="text-xs text-slate-400">Published to public materials directory</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Material Name <span className="text-rose-600 dark:text-rose-400">*</span>
                </label>
                <Input
                  placeholder="e.g. Iron Aari Needle #14"
                  value={newDraft.name}
                  onChange={e => setNewDraft({ ...newDraft, name: e.target.value })}
                  required
                  size="middle"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category <span className="text-rose-600 dark:text-rose-400">*</span>
                </label>
                <Input
                  placeholder="e.g. Needles, Threads, Beads..."
                  value={newDraft.category}
                  onChange={e => setNewDraft({ ...newDraft, category: e.target.value })}
                  required
                  size="middle"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Description <span className="text-rose-600 dark:text-rose-400">*</span>
                </label>
                <Input
                  placeholder="Brief description of supply details and suitability"
                  value={newDraft.shortDescription}
                  onChange={e => setNewDraft({ ...newDraft, shortDescription: e.target.value })}
                  required
                  size="middle"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp CTA Label
                </label>
                <Input
                  value={newDraft.whatsappLabel}
                  onChange={e => setNewDraft({ ...newDraft, whatsappLabel: e.target.value })}
                  size="middle"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sort Order
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
                  Image URL
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
                {addBusy ? 'Saving...' : 'Add Material'}
              </Button>
            </div>
          </form>
        )}

        {/* Toolbar: Categories filter and Search */}
        <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {categories.map(c => (
              <Button
                key={c}
                type={categoryFilter === c ? 'primary' : 'default'}
                size="middle"
                shape="round"
                onClick={() => setCategoryFilter(c)}
              >
                {c}
              </Button>
            ))}
          </div>

          <div className="w-full md:w-80">
            <Search
              placeholder="Search materials catalogue..."
              allowClear
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="middle"
            />
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Media Image */}
                <div className="relative h-40 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.imageUrl || defaultDetailImage}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Tag color="magenta" className="rounded-md font-semibold text-xs shadow-xs">
                      {item.category}
                    </Tag>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Tag
                      color={item.isActive ? 'success' : 'default'}
                      className="font-bold text-[10px] uppercase rounded-full shadow-xs"
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </Tag>
                  </div>
                </div>

                {/* Information */}
                <div className="p-4 space-y-2">
                  <h4 className="font-serif font-bold text-slate-800 dark:text-white text-sm line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.shortDescription}
                  </p>
                  <div className="text-[11px] text-slate-400">
                    Query: &ldquo;{item.whatsappLabel}&rdquo;
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 flex items-center justify-between">
                <Button
                  size="small"
                  icon={<Pencil size={13} />}
                  onClick={() => setEditingMaterial(item)}
                >
                  Edit
                </Button>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-medium">Active:</span>
                    <Switch
                      size="small"
                      checked={Boolean(item.isActive)}
                      onChange={checked => toggleStatus(item, checked)}
                    />
                  </div>

                  <Popconfirm
                    title="Delete material?"
                    description={`Permanently remove "${item.name}" from catalogue?`}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => removeMaterial(item)}
                  >
                    <Button
                      size="small"
                      danger
                      icon={<Trash2 size={13} />}
                      title="Delete material"
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
            title="No materials match your query"
            copy="Try adjusting filters or add a new material item."
          />
        </div>
      )}

      {/* ANT DESIGN MODAL: ISOLATED MATERIAL EDIT */}
      {editingMaterial && (
        <MaterialEditModal
          material={editingMaterial}
          onClose={() => setEditingMaterial(null)}
          onSuccess={() => {
            setEditingMaterial(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

export function MaterialEditModal({ material, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: material.name || '',
    category: material.category || 'Basic Aari Materials',
    slug: material.slug || '',
    shortDescription: material.shortDescription || '',
    whatsappLabel: material.whatsappLabel || 'Ask about materials',
    imageUrl: material.imageUrl || '',
    sortOrder: material.sortOrder || 0,
    isActive: Boolean(material.isActive),
  });
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!form.name || !form.shortDescription) {
      return toast.error('Name and short description are required.');
    }
    setBusy(true);
    try {
      const res = await fetch(`${API}/admin/materials/${material.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          sortOrder: Number(form.sortOrder) || 0,
          isActive: form.isActive ? 1 : 0,
        }),
      });

      if (!res.ok) throw new Error('Could not update material.');
      toast.success('Material updated successfully!');
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
          <Gem size={17} className="text-rose-900 dark:text-rose-400" />
          Edit Material: {material.name}
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
          Save Material Changes
        </Button>,
      ]}
      destroyOnClose
      centered
      width={640}
    >
      <div className="py-3 space-y-4">
        {/* Banner Preview */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl">
          <img
            src={form.imageUrl || material.imageUrl || defaultDetailImage}
            alt=""
            className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
          />
          <div>
            <strong className="text-sm text-slate-800 dark:text-white block font-serif">Editing Material #{material.id}</strong>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Updates will reflect in the public /materials catalogue immediately
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Material Name <span className="text-rose-600 dark:text-rose-400">*</span>
            </label>
            <Input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              size="middle"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category <span className="text-rose-600 dark:text-rose-400">*</span>
            </label>
            <Input
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              WhatsApp CTA Label
            </label>
            <Input
              value={form.whatsappLabel}
              onChange={e => setForm({ ...form, whatsappLabel: e.target.value })}
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
            Material is active & visible on public catalogue
          </span>
        </div>
      </div>
    </Modal>
  );
}
