"use client";

import { useState } from 'react';
import { apiPost } from "@/utils/api.ts";

export default function newPostForm() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    parent_post: null,
    author_id: 1
  })
  
  const handleSubmit = (e) => {
    e.preventDefault();
    apiPost("posts/", form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={e => setForm({...form, title: e.target.value})}/>
      <textarea onChange={e => setForm({...form, content: e.target.value})}/>
      <button>Create Post</button>
    </form>
  )
}
