import React from 'react';
import { Sparkles, FileText, Wand2 } from 'lucide-react';

export const Hero = () => {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Resume Enhancement</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Resume with <span className="text-blue-600">PolishAI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Upload your resume and get instant, AI-powered suggestions to make your resume stand out to recruiters and hiring managers.
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={scrollToUpload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Upload Resume
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Wand2 className="w-5 h-5" />
              See How It Works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
