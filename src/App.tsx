import React, { useState } from 'react';
import FileHandler from './components/FileHandler';
import ComparisonView from './components/ComparisonView';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { improveResume } from './services/aiService';
import { generateAndDownloadFile } from './services/fileService';

type ViewMode = 'improved' | 'comparison' | 'original';

interface ImprovementResult {
  originalContent: string;
  improvedContent: string;
  suggestions: string[];
}

const App: React.FC = () => {
  const [extractedContent, setExtractedContent] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [improvementResult, setImprovementResult] = useState<ImprovementResult | null>(null);
  const [isImproving, setIsImproving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('improved');

  const handleContentExtracted = (content: string, type: string, fileName: string) => {
    setExtractedContent(content);
    setFileType(type);
    setOriginalFileName(fileName);
  };

  const handleImprovementResult = (result: ImprovementResult) => {
    setImprovementResult(result);
    setViewMode('improved');
  };

  const handleDownload = async (content: string, isImproved: boolean = false) => {
    try {
      const fileName = isImproved 
        ? `${originalFileName.replace(/\.[^/.]+$/, '')}_improved`
        : originalFileName.replace(/\.[^/.]+$/, '');
      
      await generateAndDownloadFile(content, fileType, fileName);
    } catch (err) {
      setError('Failed to download file. Please try again.');
    }
  };

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">PolishAI</div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-blue-600">FAQ</a>
            </div>
            <button 
              onClick={scrollToPricing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Enhance Your Resume with AI
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Get instant, professional improvements to your resume using our advanced AI technology.
                Stand out to recruiters and pass ATS systems with ease.
              </p>
              <div className="max-w-xl mx-auto">
                <FileHandler
                  onError={(error) => {
                    console.error('Error:', error);
                    setError(error instanceof Error ? error.message : 'An unexpected error occurred');
                  }}
                  onContentExtracted={handleContentExtracted}
                  onImprovementResult={handleImprovementResult}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {improvementResult && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <ComparisonView
                originalContent={improvementResult.originalContent}
                improvedContent={improvementResult.improvedContent}
                suggestions={improvementResult.suggestions}
                onDownload={handleDownload}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            </div>
          </section>
        )}

        {/* Features Section */}
        <section id="features">
          <Features />
        </section>

        {/* How it Works Section */}
        <section id="how-it-works">
          <HowItWorks />
        </section>

        {/* Testimonials Section */}
        <section id="testimonials">
          <Testimonials />
        </section>

        {/* Pricing Section */}
        <section id="pricing">
          <Pricing />
        </section>

        {/* FAQ Section */}
        <section id="faq">
          <FAQ />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4"
            onClick={() => setError(null)}
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
