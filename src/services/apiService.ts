const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-resume-enhancer-backend.vercel.app';

export interface ImprovementResult {
  originalContent: string;
  improvedContent: string;
  suggestions: string[];
}

export interface ApiError {
  status: number;
  message: string;
  details?: string;
}

const handleApiError = async (response: Response): Promise<ApiError> => {
  const errorText = await response.text();
  try {
    const errorData = JSON.parse(errorText);
    return {
      status: response.status,
      message: errorData.error || 'An error occurred',
      details: errorData.details
    };
  } catch {
    return {
      status: response.status,
      message: errorText || 'An error occurred'
    };
  }
};

export const improveResume = async (file: File): Promise<ImprovementResult> => {
  try {
    console.log('Starting file upload to API:', file.name, file.type);
    const formData = new FormData();
    formData.append('file', file);

    console.log('Sending request to:', `${API_URL}/api/improve-resume`);
    const response = await fetch(`${API_URL}/api/improve-resume`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const error = await handleApiError(response);
      throw new Error(`Failed to improve resume: ${error.message}`);
    }

    const result = await response.json();
    console.log('Parsed response:', result);
    
    if (!result.originalContent || !result.improvedContent) {
      throw new Error('Invalid response format from server');
    }

    return result;
  } catch (error: any) {
    console.error('Error in improveResume:', error);
    throw new Error(error.message || 'Failed to improve resume. Please try again.');
  }
}; 