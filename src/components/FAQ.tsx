import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'How does the AI resume enhancement work?',
      answer: 'Our AI analyzes your resume using advanced natural language processing to identify areas for improvement. It suggests better phrasing, highlights achievements, and ensures your resume is optimized for ATS systems.',
    },
    {
      question: 'Is my resume data secure?',
      answer: "Yes, absolutely! We take privacy seriously. Your resume data is encrypted during transmission and processing. We don't store your resume after processing is complete, and we never share your information with third parties.",
    },
    {
      question: 'What file formats are supported?',
      answer: 'We currently support PDF and DOCX file formats. You can upload your resume in either format and download the enhanced version in your preferred format.',
    },
    {
      question: 'How long does the enhancement process take?',
      answer: 'The AI enhancement process typically takes 30-60 seconds. This includes analyzing your resume, generating improvements, and preparing the enhanced version for download.',
    },
    {
      question: 'Can I customize the AI suggestions?',
      answer: 'Yes! While our AI provides smart suggestions, you have full control over which improvements to accept. You can modify or reject any suggestions before finalizing your enhanced resume.',
    },
    {
      question: 'What makes your AI different from other resume tools?',
      answer: 'Our AI is specifically trained on successful resumes across various industries. It not only improves the content but also ensures ATS compatibility and maintains your resume\'s unique professional voice.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our AI resume enhancement service
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                className="w-full text-left p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {openIndex === index && (
                  <p className="mt-4 text-gray-600 animate-fadeIn">
                    {faq.answer}
                  </p>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
