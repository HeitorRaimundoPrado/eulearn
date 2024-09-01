"use client";

import { BsBookmark } from "react-icons/bs";
import { BsBookmarkFill } from "react-icons/bs";
import { useState, useEffect } from 'react';
import { apiGet, apiPost, apiDelete } from '@/utils/api';

interface BookmarkButtonProps {
  objectId: number,
  contentType: string,
  className?: string
}

export default function BookmarkButton({ objectId, contentType, className=""}: BookmarkButtonProps) {
  const [alreadyBookmarked, setAlreadyBookmarked] = useState(false);

  useEffect(() => {
    apiGet(`user-bookmark/?content_type=test&object_id=${objectId}`)
    .then(data => {
      setAlreadyBookmarked(true);
    })
  }, [])

  const handleBookmark = () => {
    apiPost('bookmarks/', {
      content_type: contentType,
      object_id: objectId
    })
    .then(data => {
      setAlreadyBookmarked(true);
    })
  }

  const handleRemoveBookmark = () => {
    apiDelete(`bookmarks/delete/?${new URLSearchParams({
      content_type: contentType,
      object_id: objectId.toString()
    })}`)
    .then(data => {
      setAlreadyBookmarked(false);
    })
  }

  return (
    alreadyBookmarked ?
      <button onClick={handleRemoveBookmark}><BsBookmarkFill  className={`${className}`}/></button> :
      <button onClick={handleBookmark}><BsBookmark className={`${className}`}/></button>
  )
}
