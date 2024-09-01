"use client";

import { useState, FormEvent, MouseEvent } from 'react';
import Textarea from '@/components/Textarea';
import { useRouter } from 'next/navigation'
import { apiPost } from '@/utils/api';

interface AnswerFormProps {
  parent_post: number,
  closeForm: () => void,
  className?: string
}

export function AnswerForm({ parent_post, closeForm, className="" }: AnswerFormProps) {
  const [answer, setAnswer] = useState({
    content: "",
    parent_post: parent_post
  })

  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    apiPost("posts/", answer)
    .then(data => {
      alert("Resposta enviada com sucesso!")
      router.refresh();
      closeForm()
    })
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col ${className}`}>
      <Textarea onChange={(e) => setAnswer({...answer, content: e.target.value})} className="w-full h-full grow" placeholder="Sua resposta"/>
      <button className="mt-4 py-2 px-4 bg-primary rounded-3xl w-fit">Enviar</button>
    </form>
  )
}


interface AnswerButtonProps {
  onClick: (d: MouseEvent<HTMLButtonElement>) => void,
  className?: string
}

export function AnswerButton({ onClick=(e) => {}, className=""}: AnswerButtonProps) {
  return <button onClick={onClick} className={`bg-background border-2 border-white-20 rounded-3xl px-[9px] py-[6px] text-sm w-40 ${className}`}>Responder</button>
}


interface AddAnswerComponent {
  parent_post: number,
  className?: string,
  buttonClass: string,
}


export default function AddAnswerComponent({ parent_post, className="", buttonClass="" }: AddAnswerComponent) {
  const [contentOpen, setContentOpen] = useState(false)

  const handleAlternateContent = () => {
    setContentOpen(old => !old);
  }

  return (
    <div className={`${className} flex flex-col`}>
      <AnswerButton className={buttonClass} onClick={handleAlternateContent}/>
      {
        contentOpen &&
          <AnswerForm parent_post={parent_post} closeForm={() => setContentOpen(false)} className="w-[60%] h-56"/>
      }
    </div>
  )
}

