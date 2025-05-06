import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled by a backend
});

export interface ImprovementResult {
  improvedContent: string;
  suggestions: string[];
}

export const improveResume = async (content: string): Promise<ImprovementResult> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer and career coach. Your task is to improve resumes by making them more impactful, professional, and ATS-friendly while maintaining the original meaning and facts."
        },
        {
          role: "user",
          content: `Please improve the following resume content. Focus on:
1. Making achievements more quantifiable and impactful
2. Using strong action verbs
3. Improving clarity and conciseness
4. Ensuring ATS compatibility
5. Maintaining professional tone

Here's the content to improve:
${content}`
        }
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
    });

    const improvedContent = completion.choices[0].message.content || '';
    
    // Get suggestions for further improvements
    const suggestionsCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer. Provide specific, actionable suggestions for improving the resume."
        },
        {
          role: "user",
          content: `Please provide 3-5 specific suggestions for improving this resume content:
${improvedContent}`
        }
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
    });

    const suggestions = (suggestionsCompletion.choices[0].message.content || '')
      .split('\n')
      .filter(suggestion => suggestion.trim());

    return {
      improvedContent,
      suggestions
    };
  } catch (error) {
    console.error('Error improving resume:', error);
    throw new Error('Failed to improve resume. Please try again.');
  }
}; 