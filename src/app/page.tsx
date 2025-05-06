'use client';

import FileHandler from '../components/FileHandler';
import { useState, useEffect } from 'react';

export default function Home() {
  const [initialData, setInitialData] = useState<{ message: string; status: string } | null>(null);

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://polishai-airesumeenhancerrxlfzg-3zn9igg4t.vercel.app/api/health', {
          cache: 'no-store'
        });
        const data = await response.json();
        setInitialData(data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setInitialData({
          message: 'Service is currently unavailable',
          status: 'error'
        });
      }
    };

    fetchData();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        AI Resume Enhancer
      </h1>

      <FileHandler
        onError={(error) => {
          console.error('Error:', error);
        }}
        onContentExtracted={(content, type, name) => {
          console.log('Content extracted:', { content, type, name });
        }}
        onImprovementResult={(result) => {
          console.log('Improvement result:', result);
        }}
      />

      {initialData && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-600">{initialData.message}</p>
        </div>
      )}
    </main>
  );
} 