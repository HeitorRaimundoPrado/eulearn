"use client"

import { useEffect, useState } from 'react'
import { apiGet } from '@/utils/api'
import VoteButtons from '@/components/VoteButtons'

export default function Page({ params }) {
  const { community_id, post_id } = params;

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet(`post/${post_id}`)
    .then(data => {
       setPost(data)
       setLoading(false)
     });

  }, [])

  if (loading || post === null) {
    return (
      <div>loading...</div>
    )
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <VoteButtons post={post.id} net_votes={post.net_votes}/>
    </div>
  )
}
