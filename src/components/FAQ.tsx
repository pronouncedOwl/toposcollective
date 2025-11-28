'use client';

import { useState } from 'react';
import LazySection from './LazySection';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
  className?: string;
}

export default function FAQ({ faqs, className = "" }: FAQProps) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {faqs.map((faq, index) => (
        <LazySection key={index} direction="fade" delay={100 + (index * 100)}>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div 
              className="p-5 cursor-pointer text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors flex justify-between items-center"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              <span className={`text-gray-500 transition-transform duration-200 ${openFAQ === index ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>
            
            {openFAQ === index && (
              <div className="px-5 pb-5">
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        </LazySection>
      ))}
    </div>
  );
}
