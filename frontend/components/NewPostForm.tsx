"use client";

import { useState, FormEvent, ChangeEvent } from 'react';
import { apiPost } from "@/utils/api";
import Input from './Input';
import Textarea from './Textarea';
import FileInput from './FileInput';

type NewPostFormProps = {
  is_private: string
  community: null
  subject: null
}
interface NewPostProps {
  is_private: boolean,
  community: number | null,
  subject: number | null
}

export default function NewPostForm({ is_private, community=null, subject=null }: NewPostProps) {
  const [file, setFile] = useState<File | null>(null);
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
    apiPost("posts/", form, false)
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <div className="w-full">
        <Input onChange={e => setForm({...form, title: e.target.value})} placeholder="Título" className="w-[60%] mb-4"/>
      </div>
      <Textarea onChange={(e: any) => setForm({...form, content: e.target.value})} placeholder="Conteúdo" className="w-[60%] mb-4 h-56"/>
      <FileInput onChange={handleFileChange}/>
      <button className="w-fit p-2 rounded-md bg-primary mt-4">Publicar</button>
    </form>
  )
}
