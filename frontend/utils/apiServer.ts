export default function apiServer() {
  return {
    posts: {
      // The posts route by default returns only the last 40 posts
      all: async () => {
        const res = await fethc(`${process.env.NEXT_PUBLIC_BACKEND_URI}/posts`, { cache: 'no-store' })
        return await res.json()
      },

      filter: async (subj: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/posts?subj=${subj}`, { cache: 'no-store' });
        return res.json()
      },

      getAuthors: async (posts) => {
        return await Promise.all(posts.results.map(async p => {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/user/${p.author_id}`, { cache: 'no-store' })
          const user = await res.json();
          return {
            ...p,
            author: user
          }
        }))
      }
    }
  }
}
