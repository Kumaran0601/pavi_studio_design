import React, { useState } from 'react';
import { Check, CircleAlert, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { API, serviceSlugMap } from '../../data/constants';

export function EnquiryForm() {
  const [values, setValues] = useState({ name: '', phone: '', email: '', service: '', message: '', website: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const update = (key, value) => setValues(curr => ({ ...curr, [key]: value }));

  const submit = async event => {
    event.preventDefault();
    setStatus('loading');
    setError('');
    setFieldErrors({});

    try {
      const response = await fetch(`${API}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, sourcePage: window.location.pathname }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setFieldErrors(payload?.error?.fields || {});
        throw new Error(payload?.error?.message || 'Please check the form fields.');
      }
      setStatus('success');
      setValues({ name: '', phone: '', email: '', service: '', message: '', website: '' });
      toast.success('Your enquiry has been received!');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unable to send enquiry.');
      toast.error(err instanceof Error ? err.message : 'Unable to send enquiry.');
    }
  };

  if (status === 'success') {
    return (
      <div className="success-panel" role="status">
        <div className="success-icon">
          <Check />
        </div>
        <h2>Thank you.</h2>
        <p>Thank you! Your enquiry has been received. We will contact you soon.</p>
        <button type="button" className="button button-outline" onClick={() => setStatus('idle')}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form className="enquiry-form" onSubmit={submit} noValidate>
      <div className="form-heading">
        <span className="eyebrow">Send an enquiry</span>
        <h2>Tell us what you have in mind.</h2>
        <p>Share a few details and we will contact you soon.</p>
      </div>
      <label htmlFor="enquiry-name">
        Name
        <input
          id="enquiry-name"
          name="name"
          value={values.name}
          onChange={e => update('name', e.target.value)}
          placeholder="Your name"
          aria-invalid={!!fieldErrors.name}
          required
        />
        {fieldErrors.name && <small>{fieldErrors.name}</small>}
      </label>
      <div className="form-row">
        <label htmlFor="enquiry-phone">
          Phone number
          <input
            id="enquiry-phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={e => update('phone', e.target.value)}
            placeholder="+91 98765 43210"
            aria-invalid={!!fieldErrors.phone}
            required
          />
          {fieldErrors.phone && <small>{fieldErrors.phone}</small>}
        </label>
        <label htmlFor="enquiry-email">
          Email <span>(optional)</span>
          <input
            id="enquiry-email"
            name="email"
            type="email"
            value={values.email}
            onChange={e => update('email', e.target.value)}
            placeholder="you@example.com"
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && <small>{fieldErrors.email}</small>}
        </label>
      </div>
      <label htmlFor="enquiry-service">
        Service required
        <select
          id="enquiry-service"
          name="service"
          value={values.service}
          onChange={e => update('service', e.target.value)}
          aria-invalid={!!fieldErrors.service}
          required
        >
          <option value="">Choose a service</option>
          {Object.keys(serviceSlugMap).map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {fieldErrors.service && <small>{fieldErrors.service}</small>}
      </label>
      <label htmlFor="enquiry-message">
        Message
        <textarea
          id="enquiry-message"
          name="message"
          value={values.message}
          onChange={e => update('message', e.target.value)}
          placeholder="Tell us about your design, blouse, class or material requirement"
          rows={5}
          aria-invalid={!!fieldErrors.message}
          required
        />
        {fieldErrors.message && <small>{fieldErrors.message}</small>}
      </label>
      {/* Honeypot anti-spam trap */}
      <input
        className="honeypot"
        value={values.website}
        onChange={e => update('website', e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{ display: 'none' }}
      />
      <button
        type="submit"
        className="button button-primary submit-button"
        disabled={status === 'loading'}
        aria-busy={status === 'loading'}
      >
        {status === 'loading' ? <Loader2 className="spin" size={17} /> : <Mail size={17} />}
        {status === 'loading' ? 'Sending...' : 'Send enquiry'}
      </button>
      {status === 'error' && (
        <p className="form-error" role="alert">
          <CircleAlert size={16} /> {error}
        </p>
      )}
    </form>
  );
}
