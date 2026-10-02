import React from 'react';
import { useApi } from '../../hooks/useApi';
import { defaultSettingsFallback } from '../../data/constants';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { WhatsAppFloat } from './WhatsAppFloat';
import { MobileCtaBar } from './MobileCtaBar';

export function PublicShell({ children }) {
  const { data } = useApi('/settings/public', defaultSettingsFallback);
  const settings = data || defaultSettingsFallback;

  return (
    <div className="site-shell">
      <SiteHeader settings={settings} />
      <main>{children}</main>
      <SiteFooter settings={settings} />
      <WhatsAppFloat settings={settings} />
      <MobileCtaBar settings={settings} />
    </div>
  );
}
