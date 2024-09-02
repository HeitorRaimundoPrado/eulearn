import { useMemo } from 'react';
import { apiGet } from '@/utils/api';

export default function useApi() {
  const posts = {
    all: async () => {
      return apiGet('posts/');
    }
  };

  return useMemo(() => ({ posts }), []);
}