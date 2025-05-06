import React from 'react';
import { Upload, Wand2, FileText, Check } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: <Upload className="w-6 h-6 text-blue-500" />,
      title: "Upload Your Resume",
      description: "Simply drag and drop your current resume in PDF or DOCX format."
    },
    {
      icon: <Wand2 className="w-6 h-6 text-blue-500" />,
      title: "AI Analysis",
      description: "Our advanced AI scans your resume for improvements in formatting, content, and keywords."
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      title: "Get Recommendations",
      description: "Receive actionable suggestions to make your resume stand out."
    },
    {
      icon: <Check className="w-6 h-6 text-blue-500" />,
      title: "Apply & Succeed",
      description: "Implement the changes and start getting more interview calls."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How PolishAI Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform helps you create a resume that gets noticed by recruiters and hiring managers.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
