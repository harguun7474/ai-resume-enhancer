import React, { useState } from 'react';
import { Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { improveResume } from '../services/apiService';

export const UploadSection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [improvedContent, setImprovedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      
      // Validate file type
      if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(uploadedFile.type)) {
        setError('Please upload a PDF or DOCX file');
        return;
      }

      // Validate file size (5MB limit)
      if (uploadedFile.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }

      setFile(uploadedFile);
      setError(null);
      setIsLoading(true);
      setSuccess(false);

      try {
        const result = await improveResume(uploadedFile);
        setImprovedContent(result.improvedContent);
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process file');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  return (
    <section id="upload-section" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Upload Your Resume</h2>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <p className="text-green-600">Resume processed successfully!</p>
            </div>
          )}

          <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
            ${isLoading ? 'border-gray-300' : 'border-gray-300 hover:border-blue-500'}`}>
            <div className="flex flex-col items-center justify-center gap-4">
              {isLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  <p className="text-gray-600">Processing your resume...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-blue-500" />
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Select File
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.docx" 
                      onChange={handleFileChange} 
                      disabled={isLoading}
                    />
                  </label>
                  <p className="text-sm text-gray-500">PDF or DOCX files up to 5MB</p>
                </>
              )}
            </div>
          </div>

          {improvedContent && (
            <div className="mt-6 bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Improved Resume</h3>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <pre className="whitespace-pre-wrap font-sans text-gray-800">
                  {improvedContent}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};