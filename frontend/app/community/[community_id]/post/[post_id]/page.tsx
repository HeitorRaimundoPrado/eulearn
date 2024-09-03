"use client";

import { useEffect, useState } from 'react'
import { apiGet } from '@/utils/api'
import VoteButtons from '@/components/VoteButtons'

interface Post {
  id: number;
  title: string;
  content: string;
  net_votes: number;
}

interface Params {
  community_id: string;
  post_id: string;
}

interface PageProps {
  params: Params;
}

export default function Page({ params }: PageProps) {
  const { post_id } = params;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet(`post/${post_id}`)
      .then(data => {
        setPost(data);
        setLoading(false);
      });
  }, [post_id]);

  if (loading || post === null) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <VoteButtons post={post.id} net_votes={post.net_votes} className="your-class-name" />
    </div>
  );
}
