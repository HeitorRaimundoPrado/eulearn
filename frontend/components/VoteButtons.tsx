"use client";

import { useEffect, useState } from 'react'
import { apiPost, apiGet } from '@/utils/api'

enum VotingOptions {
 Downvote = -1,
 Novote,
 Upvote
}

export default function VoteButtons({ post, net_votes }) {
  const [votes, setVotes] = useState(net_votes);
  const [hasVoted, setHasVoted] = useState(null);

  useEffect(() => {
    apiGet(`user/vote/${post}`)
    .then(data => {
      setHasVoted(data.positive ? VotingOptions.Upvote : VotingOptions.Downvote)
    })
    .catch(err => {
      setHasVoted(VotingOptions.Novote)
    })
  }, [])

  const handleUpvote = (e) => {
    apiPost("votes/", {
      post: post,
      positive: true
    })
    .then(data => {
      setVotes(old => old + 1 * (hasVoted === VotingOptions.Downvote ? 2 : 1))
      setHasVoted(VotingOptions.Upvote)
    })
  }

  const handleDownvote = (e) => {
    apiPost("votes/", {
      post: post,
      positive: false
    })
    .then(data => {
      setVotes(old => old - 1 * (hasVoted === VotingOptions.Upvote ? 2 : 1))
      setHasVoted(VotingOptions.Downvote)
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
