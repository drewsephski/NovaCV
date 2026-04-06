'use client';

import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_1TJGehIv4Ez9jUN27UtTWsu4';

const features = [
  'Custom subdomain (yourname.self.so)',
  'AI-powered resume parsing',
  'Beautiful portfolio template',
  'Instant site generation',
  'SEO optimized',
  'Mobile responsive',
  'Edit anytime',
  'Cancel anytime',
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: PRICE_ID }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1a1a]">
      <div className="max-w-4xl mx-auto px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-[#666] mb-4 block">
            Simple Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight mb-4">
            Host your <span className="font-normal italic">portfolio</span>
          </h1>
          <p className="text-lg text-[#666] max-w-xl mx-auto">
            Get a beautiful, professional portfolio site with a custom subdomain.
            No hidden fees.
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-white border border-[#e5e5e5] p-8">
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-5xl font-light text-[#1a1a1a]">$4.99</span>
              <span className="text-[#666]">/month</span>
            </div>
            <p className="text-center text-sm text-[#888] mb-8">
              Billed monthly. Cancel anytime.
            </p>

            <ul className="space-y-4 mb-8">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[#f0f0f0] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#1a1a1a]" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm text-[#555]">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full h-12 text-sm font-medium bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </>
              )}
            </button>

            <p className="text-center text-xs text-[#999] mt-4">
              Secure payment powered by Stripe
            </p>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-20"
        >
          <h2 className="text-lg font-normal text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. Your site will remain active until the end of your billing period.' },
              { q: 'What happens after I subscribe?', a: 'After subscribing, you can upload your resume and claim your custom subdomain. Your site will be live in seconds.' },
              { q: 'Is there a free trial?', a: 'We don&apos;t offer a free trial, but you can see a preview of your site before subscribing.' },
              { q: 'Can I change my subdomain?', a: 'Yes, you can change your subdomain at any time from your dashboard.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-[#e5e5e5] p-4">
                <h3 className="text-sm font-normal text-[#1a1a1a] mb-1">{faq.q}</h3>
                <p className="text-xs text-[#666]">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
