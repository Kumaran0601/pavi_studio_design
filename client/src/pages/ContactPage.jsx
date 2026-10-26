import React from 'react';
import { Phone, Instagram, MapPin, ExternalLink } from 'lucide-react';
import { defaultFloralImage, defaultSettingsFallback } from '../data/constants';
import { usePageMeta } from '../hooks/usePageMeta';
import { PageIntro } from '../components/common/PageIntro';
import { SectionHeading } from '../components/common/SectionHeading';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { EnquiryForm } from '../components/forms/EnquiryForm';

export function ContactPage({ state }) {
  usePageMeta(
    'Contact Pavi Designer Studio | Padi, Chennai',
    'Contact Pavi Designer Studio & Training Center in Padi, Chennai for Aari embroidery, bridal blouse work, customized designs, classes and materials.',
    '/contact'
  );
  const settings = state.data?.settings || defaultSettingsFallback;

  return (
    <>
      <PageIntro
        eyebrow="Let's talk"
        title="Have a design in mind?"
        description="Tell us what you are looking for and the studio will get back to you soon."
        image={state.data?.gallery?.[4]?.imageUrl || defaultFloralImage}
      />
      <section className="section contact-page">
        <div className="container contact-grid">
          <EnquiryForm />
          <div className="contact-info">
            <SectionHeading eyebrow="Reach the studio" title="Padi, Chennai" copy="Choose the channel that works best for you." />
            <div className="contact-method">
              <Phone size={20} />
              <div>
                <span>Call</span>
                {settings.phones?.map(phone => (
                  <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`}>
                    {phone}
                  </a>
                ))}
              </div>
            </div>
            <div className="contact-method">
              <WhatsAppIcon size={20} color="#25D366" />
              <div>
                <span>WhatsApp</span>
                <a
                  href={`https://wa.me/${(settings.whatsappNumber || '917358461060').replace(/\D/g, '')}?text=${encodeURIComponent(
                    'Hi Pavi Designer Studio, I would like to enquire about Aari embroidery work.'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-whatsapp-link"
                >
                  Start a conversation
                </a>
              </div>
            </div>

            <div className="contact-method">
              <Instagram size={20} />
              <div>
                <span>Instagram</span>
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer">
                  {settings.instagramHandle}
                </a>
              </div>
            </div>
            <div className="contact-method">
              <MapPin size={20} />
              <div>
                <span>Address</span>
                <p>
                  {settings.addressLines?.map(line => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
                <a
                  href={
                    settings.googleMapsUrl && !settings.googleMapsUrl.includes('Pavi+Designer+Studio+Training+Center')
                      ? settings.googleMapsUrl
                      : 'https://www.google.com/maps/search/?api=1&query=20%2F1%2C+Padavattamman+Koil+Street%2C+Padi%2C+Chennai%2C+Tamil+Nadu+600050'
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Get directions <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
