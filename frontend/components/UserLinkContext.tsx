"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface UserLinkContextProps {
  id: number,
  username: string
}

export default function UserLinkContext({ id, username }: UserLinkContextProps) {
  const [userContext, setUserContext] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null)

  const handleHover = () => {
    setUserContext(true);
  }

  const handleLeaveUsername = () => {
    setUserContext(false)
  }
    
  const handleLeave = () => {
    setUserContext(false)
  }

  const handleEnterMenu = () => {
    setUserContext(true)
  }

  return (
    <div className="relative">
      <p onMouseEnter={handleHover} onMouseLeave={handleLeaveUsername}>{username}</p>
      <div onMouseLeave={handleLeave} onMouseEnter={handleEnterMenu} className={`${userContext ? "" : "hidden" } bg-secondary p-2 absolute rounded-md border-white border-[2px] border-opacity-[60%] w-[130px]`}>
        <Link href={`/message/${id}`} >Message User</Link>
      </div>
    </div>
  )
}
