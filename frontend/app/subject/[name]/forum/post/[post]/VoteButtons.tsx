"use client";

import { useState } from 'react'
import { apiPost } from '@/utils/api'

export default function VoteButtons({ post, net_votes }) {
  const [votes, setVotes] = useState(net_votes);

  const handleUpvote = (e) => {
    apiPost("votes/", {
      post: post,
      positive: true
    })
    .then(data => {
      console.log(data);
      setVotes(old => old + 1)
    })
  }

  const handleDownvote = (e) => {
    apiPost("votes/", {
      post: post,
      positive: false
    })
    .then(data => {
      console.log(data);
      setVotes(old => old - 1)
    })
  }

  return (
    <div>
      <p>{votes}</p>
      <button onClick={handleUpvote}>Upvote</button>
      <button onClick={handleDownvote}>Downvote</button>
    </div>
  )
}
