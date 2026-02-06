'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTurnstile } from './TurnstileProvider';
import CTAButton from './CTAButton';

interface ContactFormProps {
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  cfTurnstileResponse?: string;
}

export default function ContactForm({ className = "" }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    cfTurnstileResponse: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rateLimited'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { isReady: turnstileLoaded } = useTurnstile();

  const handleTurnstileCallback = useCallback((token: string) => {
    setFormData(prev => ({
      ...prev,
      cfTurnstileResponse: token
    }));
  }, []);

  // Render Turnstile widget when ready
  useEffect(() => {
    if (turnstileLoaded && window.turnstile) {
      // Check if widget already exists
      const existingWidget = document.querySelector('#cf-turnstile iframe');
      if (!existingWidget) {
        window.turnstile.render('#cf-turnstile', {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAACEC45q77suzzFP7',
          callback: handleTurnstileCallback
        });
      }
    }
  }, [turnstileLoaded, handleTurnstileCallback]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if Turnstile token is present
    if (!formData.cfTurnstileResponse) {
      setSubmitStatus('error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setErrorMessage('');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          cfTurnstileResponse: ''
        });
        // Reset Turnstile widget
        if (window.turnstile) {
          window.turnstile.reset('#cf-turnstile');
        }
      } else if (response.status === 429) {
        // Rate limit exceeded
        const data = await response.json();
        const retryMinutes = data.retryAfterMinutes || 15;
        setSubmitStatus('rateLimited');
        setErrorMessage(`You've submitted too many requests. To prevent spam, we limit contact form submissions to 3 per 15 minutes. Please try again in ${retryMinutes} minute${retryMinutes !== 1 ? 's' : ''}.`);
      } else {
        setSubmitStatus('error');
        setErrorMessage('');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b7d98] focus:border-transparent"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b7d98] focus:border-transparent"
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b7d98] focus:border-transparent"
          placeholder="(512) 555-0123"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b7d98] focus:border-transparent"
          placeholder="Tell us about your project or inquiry..."
        />
      </div>

      {/* Cloudflare Turnstile */}
      <div>
        <div 
          id="cf-turnstile" 
          className="flex justify-center"
        />
      </div>

      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-800">Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.</p>
        </div>
      )}

      {submitStatus === 'rateLimited' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800 font-medium">{errorMessage}</p>
          <p className="text-yellow-700 text-sm mt-2">If you need immediate assistance, please call us at (512) 850-8560.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Sorry, there was an error sending your message. Please try again or contact us directly at (512) 850-8560.</p>
        </div>
      )}

      <CTAButton
        type="submit"
        disabled={isSubmitting}
        fullWidth
        size="lg"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </CTAButton>
    </form>
  );
}

