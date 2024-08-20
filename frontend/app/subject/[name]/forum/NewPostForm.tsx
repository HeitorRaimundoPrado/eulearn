"use client";

import { useState, FormEvent } from 'react';
import { apiPost } from "@/utils/api";

export default function NewPostForm() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    parent_post: null
  })
  
  const handleSubmit = (e: FormEvent) => {
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
