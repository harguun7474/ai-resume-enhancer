import { FileHandler } from '../components/FileHandler';

async function getInitialData() {
  try {
    const response = await fetch('https://polishai-airesumeenhancerrxlfzg-3zn9igg4t.vercel.app/api/health', {
      cache: 'no-store'
    });
    return response.json();
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return {
      message: 'Service is currently unavailable',
      status: 'error'
    };
  }
}

export default async function Home() {
  const initialData = await getInitialData();

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