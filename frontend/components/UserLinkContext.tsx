"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function UserLinkContext({ id, username }) {
  const [userContext, setUserContext] = useState(false);

  const handleHover = () => {
    setUserContext(true);
  }

  const handleLeave = () => {
    setUserContext(false);
  }

  return (
    <div>
      <p onMouseEnter={handleHover}>{username}</p>
      <div onMouseLeave={handleLeave} className={`${userContext ? "" : "hidden" } bg-gray-400 p-2`}>
        <Link href={`/message/${id}`}>Message User</Link>
      </div>
    </div>
  )
}
