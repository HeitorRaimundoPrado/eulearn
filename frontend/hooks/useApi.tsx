import { useMemo } from 'react';
import { apiGet, apiPost } from '@/utils/api'
import Post from '@/interfaces/Post'


export default  function useApi() {
  const posts = {
    all: async () => {
      return apiGet('posts/')
    }
  }

  return useMemo<any>(() => ({
    posts: posts
  }), [])
}
