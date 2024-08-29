"use client";

import { useEffect, useState } from 'react'
import { apiPost, apiGet } from '@/utils/api'
import { IoArrowUpOutline, IoArrowDownOutline } from "react-icons/io5";

enum VotingOptions {
 Downvote = -1,
 Novote,
 Upvote
}

export default function VoteButtons({ post, net_votes, className="" }) {
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
    <div className={`flex flex-row items-center bg-secondary w-fit p-2 px-4 rounded-md ${className}`}>
      <div className="flex flex-col">
        <button className={`mr-4 mb-[2px] ${hasVoted === VotingOptions.Upvote ? "text-primary" : "" }`}onClick={handleUpvote}><IoArrowUpOutline/></button>
        <button className={`${hasVoted === VotingOptions.Downvote ? "text-primary" : "" }`}onClick={handleDownvote}><IoArrowDownOutline/></button>
      </div>
      <p>{votes}</p>
    </div>
  )
}
