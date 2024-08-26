"use client";

import { useState, FormEvent } from 'react';
import { apiPost } from "@/utils/api";
import { IoMdAttach } from 'react-icons/io';
import Input from './Input';
import Textarea from './Textarea';

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
      <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <div className="w-full">
        <Input onChange={e => setForm({...form, title: e.target.value})} placeholder="Título"/>
      </div>
      <Textarea onChange={e => setForm({...form, content: e.target.value})} placeholder="Conteúdo" className="w-[60%] mb-4 h-56"/>
      <label  htmlFor="file-input"><IoMdAttach className="h-auto w-8 hover:cursor-pointer"/></label>
      <input type="file" onChange={handleFileChange} className="hidden" id="file-input"/>
      <button className="w-fit p-2 rounded-md bg-primary mt-4">Publicar</button>
    </form>
  )
}
