import React, { useState } from 'react';
import {
  Check,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  Star,
} from 'lucide-react';
import {
  Button,
  Modal,
  Input,
  Select,
  Checkbox,
  Tag,
  Popconfirm,
} from 'antd';
import { toast } from 'sonner';
import { API } from '../data/constants';
import { EmptyState } from '../components/common/EmptyState';

const { Search } = Input;

export function GalleryManager({ items = [], onRefresh }) {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Upload draft state
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Bridal');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadAltText, setUploadAltText] = useState('');
  const [uploadFeatured, setUploadFeatured] = useState(true);
  const [uploadBusy, setUploadBusy] = useState(false);

  const categories = ['All', 'Bridal', 'Aari Work', 'Customized', 'Blouse', 'Brooches', 'Training'];

  const onFileChange = e => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      setPreviewUrl('');
    }
  };

  const handleUpload = async e => {
    e.preventDefault();
    if (!file || !uploadAltText) {
      return toast.error('Please choose an image file and provide descriptive alt text.');
    }

    setUploadBusy(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('altText', uploadAltText);

      const uploadRes = await fetch(`${API}/admin/media`, {
        method: 'POST',
        body: form,
        credentials: 'include',
      });
      const uploadPayload = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadPayload?.error?.message || 'Media upload failed');

      const imageUrl = uploadPayload.data.publicUrl;

      const res = await fetch(`${API}/admin/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          imageUrl,
          category: uploadCategory,
          caption: uploadCaption || null,
          altText: uploadAltText,
          isFeatured: uploadFeatured,
          isPublished: true,
        }),
      });

      if (!res.ok) throw new Error('Gallery record could not be saved in database.');

      toast.success('New gallery image published successfully!');
      setFile(null);
      setPreviewUrl('');
      setUploadCaption('');
      setUploadAltText('');
      setShowUpload(false);
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadBusy(false);
    }
  };

  const remove = async id => {
    try {
      const res = await fetch(`${API}/admin/gallery/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Gallery photo removed.');
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error deleting item');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.caption && item.caption.toLowerCase().includes(q)) ||
      (item.altText && item.altText.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Sparkles className="text-amber-600 dark:text-amber-400" size={20} />
              Studio Gallery Works
              <span className="text-xs px-2.5 py-0.5 font-sans font-semibold rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
                {filteredItems.length} photos
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Curate customer bridal blouses, fine zardosi embroidery, and portfolio showcases
            </p>
          </div>

          <Button
            type="primary"
            icon={showUpload ? <X size={15} /> : <Plus size={15} />}
            onClick={() => setShowUpload(!showUpload)}
            size="middle"
          >
            {showUpload ? 'Close Form' : 'Upload New Photo'}
          </Button>
        </div>

        {/* Collapsible Upload Form Card */}
        {showUpload && (
          <form
            onSubmit={handleUpload}
            className="my-5 p-5 bg-slate-50/70 dark:bg-slate-800/60 border border-rose-100 dark:border-slate-700 rounded-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-semibold text-rose-950 dark:text-rose-300 text-base flex items-center gap-2">
                <Upload size={16} className="text-rose-900 dark:text-rose-400" />
                Add New Photo to Portfolio
              </h4>
              <span className="text-xs text-slate-400">Web-optimized auto-processing</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Image File <span className="text-slate-400 font-normal">(JPG, PNG, WebP)</span>
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={onFileChange}
                  required
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-50 dark:file:bg-rose-950/60 file:text-rose-900 dark:file:text-rose-300 hover:file:bg-rose-100 cursor-pointer border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Craft Category
                </label>
                <Select
                  value={uploadCategory}
                  onChange={val => setUploadCategory(val)}
                  className="w-full"
                  size="middle"
                  options={['Bridal', 'Aari Work', 'Customized', 'Blouse', 'Brooches', 'Training'].map(c => ({
                    value: c,
                    label: c,
                  }))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alt Text / SEO Description <span className="text-rose-600 dark:text-rose-400">*</span>
                </label>
                <Input
                  placeholder="e.g. Detailed gold thread Aari embroidery on crimson silk"
                  value={uploadAltText}
                  onChange={e => setUploadAltText(e.target.value)}
                  required
                  size="middle"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Caption / Title <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <Input
                  placeholder="e.g. Bridal Blouse Intricate Sleeve Detailing"
                  value={uploadCaption}
                  onChange={e => setUploadCaption(e.target.value)}
                  size="middle"
                />
              </div>
            </div>

            {previewUrl && (
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-3">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-md border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Selected File Preview</span>
                  <span className="text-[11px] text-slate-400">{file?.name}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Checkbox
                checked={uploadFeatured}
                onChange={e => setUploadFeatured(e.target.checked)}
              >
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Highlight on Home Page Featured Works
                </span>
              </Checkbox>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    setShowUpload(false);
                    setPreviewUrl('');
                    setFile(null);
                  }}
                  size="middle"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={uploadBusy}
                  icon={<Sparkles size={14} />}
                  size="middle"
                >
                  {uploadBusy ? 'Uploading...' : 'Publish to Gallery'}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Categories Pills & Search */}
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
              placeholder="Search captions or alt text..."
              allowClear
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="middle"
            />
          </div>
        </div>
      </div>

      {/* Visual Photos Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
            >
              {/* Image Thumbnail */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={item.imageUrl}
                  alt={item.altText || ''}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <Tag color="magenta" className="rounded-md font-semibold text-xs shadow-xs">
                    {item.category}
                  </Tag>
                </div>
                {item.isFeatured ? (
                  <div className="absolute top-2 right-2">
                    <Tag color="gold" className="rounded-md font-semibold text-xs shadow-xs flex items-center gap-1">
                      <Star size={11} className="fill-amber-500 text-amber-500" />
                      Featured
                    </Tag>
                  </div>
                ) : null}
              </div>

              {/* Information */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-slate-800 dark:text-white text-sm line-clamp-1">
                    {item.caption || item.category}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.altText || 'No description provided'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    #{item.id} · Ord: {item.sortOrder || 0}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="small"
                      icon={<Pencil size={13} />}
                      onClick={() => setEditingItem(item)}
                    >
                      Edit
                    </Button>

                    <Popconfirm
                      title="Delete this gallery photo?"
                      description="This will permanently delete the photo from the portfolio."
                      okText="Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => remove(item.id)}
                    >
                      <Button
                        size="small"
                        danger
                        icon={<Trash2 size={13} />}
                        title="Delete photo"
                      />
                    </Popconfirm>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8">
          <EmptyState
            title="No gallery items found"
            copy="Try choosing another category, adjusting your search term, or upload a new photo."
          />
        </div>
      )}

      {/* ANT DESIGN MODAL: ISOLATED GALLERY EDIT */}
      {editingItem && (
        <GalleryEditModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            setEditingItem(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

export function GalleryEditModal({ item, onClose, onSuccess }) {
  const [category, setCategory] = useState(item.category || 'Bridal');
  const [caption, setCaption] = useState(item.caption || '');
  const [altText, setAltText] = useState(item.altText || '');
  const [imageUrl, setImageUrl] = useState(item.imageUrl || '');
  const [isFeatured, setIsFeatured] = useState(Boolean(item.isFeatured));
  const [sortOrder, setSortOrder] = useState(item.sortOrder || 0);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!altText) {
      return toast.error('Alt text is required for SEO accessibility.');
    }
    setBusy(true);
    try {
      const res = await fetch(`${API}/admin/gallery/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          category,
          caption: caption || null,
          altText,
          imageUrl,
          isFeatured: isFeatured ? 1 : 0,
          sortOrder: Number(sortOrder) || 0,
        }),
      });

      if (!res.ok) throw new Error('Failed to update gallery photo details.');
      toast.success('Gallery photo updated successfully!');
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
          <Pencil size={17} className="text-rose-900 dark:text-rose-400" />
          Edit Gallery Photo #{item.id}
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
          Save Changes
        </Button>,
      ]}
      destroyOnClose
      centered
      width={600}
    >
      <div className="py-3 space-y-4">
        {/* Photo Preview Strip */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl">
          <img
            src={imageUrl || item.imageUrl}
            alt=""
            className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
          />
          <div>
            <strong className="text-sm text-slate-800 dark:text-white block font-serif">Photo #{item.id}</strong>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Update category, display caption, SEO tags, or URL below
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <Select
              value={category}
              onChange={val => setCategory(val)}
              className="w-full"
              size="middle"
              options={['Bridal', 'Aari Work', 'Customized', 'Blouse', 'Brooches', 'Training'].map(c => ({
                value: c,
                label: c,
              }))}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Sort Order Index</label>
            <Input
              type="number"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              size="middle"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Caption / Title</label>
          <Input
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Display title for portfolio card"
            size="middle"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Alt Text <span className="text-rose-600 dark:text-rose-400">*</span>
          </label>
          <Input
            value={altText}
            onChange={e => setAltText(e.target.value)}
            placeholder="Describe the craft details for accessibility and Google SEO"
            size="middle"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
          <Input
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="/uploads/... or external link"
            size="middle"
          />
        </div>

        <div className="pt-2">
          <Checkbox
            checked={isFeatured}
            onChange={e => setIsFeatured(e.target.checked)}
          >
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Highlight on Home Page as Featured Work
            </span>
          </Checkbox>
        </div>
      </div>
    </Modal>
  );
}
