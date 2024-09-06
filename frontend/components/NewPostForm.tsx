"use client";

import { useState, FormEvent, ChangeEvent } from 'react';
import { apiPost } from "@/utils/api";
import Input from './Input';
import TextEditor from './TextEditor';
import FileInput from './FileInput';

type NewPostFormProps = {
  is_private: string
  community: null
  subject: null
}
interface NewPostProps {
  is_private: boolean,
  community?: number | null,
  subject: string | null
}

export default function NewPostForm({ is_private, community=null, subject=null }: NewPostProps) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    parent_post: null,
    private: is_private, 
    community: community,
    subject: subject
  })
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title)
    formData.append('content', form.content)
    formData.append('parent_post', "")
    formData.append('private', form.private ? form.private.toString() : "")
    formData.append('community', form.community ? form.community.toString() : "")
    formData.append('subject', form.subject ? form.subject.toString() : "")

    const parsedContent = JSON.parse(form.content)
    let idx = 0;
    for (const c of parsedContent) {
      if (c.type === "image") {
        const res = await fetch(c.url);
        const f = await res.blob();
        formData.append('files', f)
        idx++;
      }
    }

    apiPost("posts/", formData, true)
    .then(data => {
      alert('Post criado com sucesso!')
    })
  }


  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <Input onChange={e => setForm({...form, title: e.target.value})} placeholder="Título" className="w-[60%] mb-4"/>
      </div>
      <TextEditor onChange={(c) => setForm(oldForm => ({...oldForm, content: JSON.stringify(c)}))}/>
      <button onClick={handleSubmit} className="w-fit p-2 rounded-md bg-primary mt-4">Publicar</button>
    </div>
  )
}
