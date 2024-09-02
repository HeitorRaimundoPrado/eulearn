"use client";

import { useEffect, useState } from 'react'
import { apiPost, apiGet } from '@/utils/api'
import { IoArrowUpOutline, IoArrowDownOutline } from "react-icons/io5";
import Post from '@/interfaces/Post';

enum VotingOptions {
 Downvote = -1,
 Novote,
 Upvote
}
interface VoteButtonsProps {
  post: number,
  net_votes: number,
  className: string
}

export default function VoteButtons({ post, net_votes, className="" }: VoteButtonsProps) {
  const [votes, setVotes] = useState<number>(net_votes);
  const [hasVoted, setHasVoted] = useState<VotingOptions | null>(null);

  useEffect(() => {
    apiGet(`user/vote/${post}`)
    .then(data => {
      setHasVoted(data.positive ? VotingOptions.Upvote : VotingOptions.Downvote)
    })
    .catch(err => {
      setHasVoted(VotingOptions.Novote)
    })
  }, [])

  const handleUpvote = () => {
    apiPost("votes/", {
      post: post,
      positive: true
    }, false)
    .then(data => {
      setVotes(old => old + 1 * (hasVoted === VotingOptions.Downvote ? 2 : 1))
      setHasVoted(VotingOptions.Upvote)
    })
  }

  const handleDownvote = () => {
    apiPost("votes/", {
      post: post,
      positive: false
    }, false)
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
