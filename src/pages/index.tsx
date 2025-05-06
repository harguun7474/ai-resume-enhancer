import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { FileHandler } from '../components/FileHandler';

interface HomeProps {
  initialData?: {
    message: string;
    status: string;
  };
}

export default function Home({ initialData }: HomeProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          AI Resume Enhancer
        </h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <FileHandler
          onError={setError}
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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch('https://polishai-airesumeenhancerrxlfzg-3zn9igg4t.vercel.app/api/health');
    const data = await response.json();

    return {
      props: {
        initialData: data
      }
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return {
      props: {
        initialData: {
          message: 'Service is currently unavailable',
          status: 'error'
        }
      }
    };
  }
}; 