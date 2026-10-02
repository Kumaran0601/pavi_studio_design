import React, { useState, useEffect } from 'react';
import {
  Check,
  MapPin,
  Settings,
  Building,
  Phone,
  Compass,
} from 'lucide-react';
import {
  Button,
  Input,
  Tag,
} from 'antd';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';

import { toast } from 'sonner';
import { API, defaultSettingsFallback } from '../data/constants';

const { TextArea } = Input;

export function SettingsManager({ settings, onRefresh }) {
  const current = settings || defaultSettingsFallback;

  const [form, setForm] = useState(current);
  const [address, setAddress] = useState(current.addressLines?.join('\n') || '');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm(settings);
      setAddress(settings.addressLines?.join('\n') || '');
    }
  }, [settings]);

  const save = async e => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(`${API}/admin/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          addressLines: address
            .split('\n')
            .map(l => l.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) throw new Error('Settings update failed.');
      toast.success('Business settings saved successfully!');
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Settings className="text-rose-900 dark:text-rose-400" size={20} />
              Studio Identity & Business Settings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Global brand profile, phone numbers, WhatsApp routing, and physical studio address
            </p>
          </div>
          <Tag color="magenta" className="font-semibold text-xs px-3 py-1 rounded-full">
            Global Studio Profile
          </Tag>
        </div>

        <form onSubmit={save} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Studio Profile Card */}
            <div className="p-5 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl space-y-4">
              <h4 className="font-serif font-semibold text-rose-950 dark:text-rose-300 text-base flex items-center gap-2">
                <Building size={18} className="text-rose-900 dark:text-rose-400" />
                Brand Information
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Business Name <span className="text-rose-600 dark:text-rose-400">*</span>
                </label>
                <Input
                  value={form.businessName || ''}
                  onChange={e => setForm({ ...form, businessName: e.target.value })}
                  required
                  size="middle"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline / Motto
                </label>
                <Input
                  value={form.tagline || ''}
                  onChange={e => setForm({ ...form, tagline: e.target.value })}
                  size="middle"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Homepage Hero Image URL
                </label>
                <Input
                  value={form.heroImageUrl || ''}
                  onChange={e => setForm({ ...form, heroImageUrl: e.target.value })}
                  size="middle"
                />
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="p-5 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl space-y-4">
              <h4 className="font-serif font-semibold text-rose-950 dark:text-rose-300 text-base flex items-center gap-2">
                <Phone size={18} className="text-rose-900 dark:text-rose-400" />
                Phone & Social Connect
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Numbers <span className="text-slate-400 font-normal">(Comma separated)</span>
                </label>
                <Input
                  value={form.phones?.join(', ') || ''}
                  onChange={e =>
                    setForm({
                      ...form,
                      phones: e.target.value.split(',').map(p => p.trim()).filter(Boolean),
                    })
                  }
                  size="middle"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp Number <span className="text-slate-400 font-normal">(e.g. 917358461060)</span>
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={form.whatsappNumber || ''}
                    onChange={e => setForm({ ...form, whatsappNumber: e.target.value })}
                    size="middle"
                  />
                  <Button
                    type="primary"
                    style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                    icon={<WhatsAppIcon size={15} color="#ffffff" />}
                    href={`https://wa.me/${form.whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    size="middle"
                  >
                    Test
                  </Button>

                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Instagram Profile URL
                </label>
                <Input
                  placeholder="https://instagram.com/..."
                  value={form.instagramUrl || ''}
                  onChange={e => setForm({ ...form, instagramUrl: e.target.value })}
                  size="middle"
                />
              </div>
            </div>
          </div>

          {/* Location and Address Card */}
          <div className="p-5 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl space-y-4">
            <h4 className="font-serif font-semibold text-rose-950 dark:text-rose-300 text-base flex items-center gap-2">
              <MapPin size={18} className="text-rose-900 dark:text-rose-400" />
              Studio Physical Address & Location
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Studio Address <span className="text-slate-400 font-normal">(One line per line break)</span>
              </label>
              <TextArea
                rows={4}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Door No, Street Name&#10;Landmark&#10;Padi, Chennai - 600050"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Google Maps Directions URL
              </label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="https://maps.google.com/..."
                  value={form.googleMapsUrl || ''}
                  onChange={e => setForm({ ...form, googleMapsUrl: e.target.value })}
                  size="middle"
                />
                {form.googleMapsUrl && (
                  <Button
                    icon={<Compass size={15} />}
                    href={form.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    size="middle"
                  >
                    Preview
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={busy}
              icon={<Check size={15} />}
              size="large"
            >
              {busy ? 'Saving...' : 'Save All Business Settings'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
