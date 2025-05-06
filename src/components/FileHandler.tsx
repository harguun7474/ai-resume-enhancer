'use client';

import React, { useState, useCallback } from 'react';
import { improveResume } from '../services/apiService';

interface FileHandlerProps {
  onContentExtracted: (content: string, fileType: string, fileName: string) => void;
  onImprovementResult: (result: {
    originalContent: string;
    improvedContent: string;
    images?: any[];
    metadata?: any;
    html?: string;
  }) => void;
}

const FileHandler: React.FC<FileHandlerProps> = ({ onContentExtracted, onImprovementResult }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Validate file type
      if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        throw new Error('Please upload a PDF or DOCX file only.');
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size should be less than 5MB');
      }

      const result = await improveResume(file);
      
      if (!result.originalContent || !result.improvedContent) {
        throw new Error('Invalid response from server. Please try again.');
      }

      onContentExtracted(result.originalContent, file.type, file.name);
      onImprovementResult({
        originalContent: result.originalContent,
        improvedContent: result.improvedContent,
        images: result.images,
        metadata: result.metadata,
        html: result.html
      });
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [onContentExtracted, onImprovementResult]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(event);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg relative">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0">⚠️</div>
            <div className="flex-1">
              <p className="text-red-600 font-medium">Error</p>
              <p className="text-red-500 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-500 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div
        className={`card p-8 text-center transition-all duration-200 ${
          isDragging ? 'border-2 border-dashed border-blue-500 bg-blue-50' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-6">
          <div className="mx-auto h-12 w-12 text-gray-400">
            📄
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Upload your resume
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Drag and drop your PDF or DOCX file here, or click to select
        </p>

        <label className="btn-primary cursor-pointer inline-block">
          <span>Choose File</span>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileUpload}
            disabled={isProcessing}
            className="hidden"
          />
        </label>

        {isProcessing && (
          <div className="mt-6 space-y-2">
            <div className="loading-spinner mx-auto"></div>
            <div className="text-sm text-gray-500">
              Processing your resume...
            </div>
            <div className="text-xs text-gray-400">
              This may take 30-60 seconds as we're using AI to improve your resume.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileHandler; 