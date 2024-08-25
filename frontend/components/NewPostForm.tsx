"use client";

import { useState, FormEvent } from 'react';
import { apiPost } from "@/utils/api";

export default function NewPostForm({ is_private, community=null, subject=null }) {
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    parent_post: null,
    private: is_private, 
    community: community,
    subject: subject
  })
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    apiPost("posts/", form)
    .then(data => {
      if (file !== null) {
        const formData = new FormData();
        formData.append('file', file)
        formData.append('post', data.id)
        apiPost('post-attachment/', formData, true)
        .then(data => alert('Post criado com sucesso!'))
        return;
      }

      alert('Post criado com sucesso')
    })
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <input onChange={e => setForm({...form, title: e.target.value})}/>
      <textarea onChange={e => setForm({...form, content: e.target.value})}/>
      <button>Create Post</button>
    </form>
  )
}
