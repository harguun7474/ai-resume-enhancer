import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const API_URL = 'https://polishai-airesumeenhancerrxlfzg-3zn9igg4t.vercel.app/graphql';

export const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
  credentials: 'include'
});

export const IMPROVE_RESUME = gql`
  mutation ImproveResume($file: Upload!) {
    improveResume(file: $file) {
      originalContent
      improvedContent
      suggestions
    }
  }
`;

export const GET_RESUME_STATUS = gql`
  query GetResumeStatus($id: ID!) {
    resumeStatus(id: $id) {
      status
      progress
      result {
        originalContent
        improvedContent
        suggestions
      }
    }
  }
`;

export const graphqlService = {
  async improveResume(file: File) {
    try {
      const { data } = await client.mutate({
        mutation: IMPROVE_RESUME,
        variables: { file }
      });
      return data.improveResume;
    } catch (error) {
      console.error('GraphQL error:', error);
      throw error;
    }
  },

  async getResumeStatus(id: string) {
    try {
      const { data } = await client.query({
        query: GET_RESUME_STATUS,
        variables: { id }
      });
      return data.resumeStatus;
    } catch (error) {
      console.error('GraphQL error:', error);
      throw error;
    }
  }
}; 