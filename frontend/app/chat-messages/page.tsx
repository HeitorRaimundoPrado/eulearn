"use client";

import { useEffect, useState } from 'react';
import { apiGet } from '@/utils/api';

export default function Page() {
  const [chatLists, setChatLists] = useState([])

  useEffect(() => {
    apiGet('user-chats')
    .then(data => console.log(data))
  }, [])

  return (
    <div>
    {

    }
    </div>
  )
}
