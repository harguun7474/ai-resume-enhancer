import React, { useState } from 'react';
import { Download, Eye, EyeOff } from 'lucide-react';
import { diffWords } from 'diff';

interface ComparisonViewProps {
  originalContent: string;
  improvedContent: string;
  images?: any[];
  metadata?: any;
  html?: string;
  suggestions: string[];
  onDownload: (content: string, isImproved: boolean) => void;
  viewMode: 'improved' | 'comparison' | 'original';
  setViewMode: (mode: 'improved' | 'comparison' | 'original') => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  originalContent,
  improvedContent,
  images,
  metadata,
  html,
  suggestions,
  onDownload,
  viewMode,
  setViewMode
}) => {
  const [showImages, setShowImages] = useState(true);

  const differences = diffWords(originalContent, improvedContent);

  const renderContent = (content: string) => {
    if (html && viewMode === 'original') {
      return (
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    return (
      <div className="prose max-w-none">
        {content.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    );
  };

  const renderImages = () => {
    if (!images || !showImages) return null;

    return (
      <div className="mt-4 grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            {image.image ? (
              <img
                src={`data:image/png;base64,${image.image.toString('base64')}`}
                alt={`Image ${index + 1}`}
                className="w-full h-auto rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Image not available</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => setViewMode('improved')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'improved'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Improved Version
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'comparison'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Comparison View
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'original'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Original Version
          </button>
        </div>
        <div className="flex space-x-4">
          {images && images.length > 0 && (
            <button
              onClick={() => setShowImages(!showImages)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              {showImages ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Hide Images</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Show Images</span>
                </>
              )}
            </button>
          )}
          <button
            onClick={() => onDownload(viewMode === 'improved' ? improvedContent : originalContent, viewMode === 'improved')}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Download {viewMode === 'improved' ? 'Improved' : 'Original'} Version</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {viewMode === 'comparison' ? (
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Original Version</h3>
              {renderContent(originalContent)}
              {renderImages()}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Improved Version</h3>
              {renderContent(improvedContent)}
              {renderImages()}
            </div>
          </div>
        ) : (
          <div>
            {renderContent(viewMode === 'improved' ? improvedContent : originalContent)}
            {renderImages()}
          </div>
        )}
      </div>

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">AI Suggestions</h3>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ComparisonView; 