'use client';

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/Input'
import Alert from '@/components/Alert'

export default function Page() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  })

  const [showModal, setShowModal] = useState(false);

  const router = useRouter()

  const handleAlertOpenChange = (open: boolean) => {
    setShowModal(open)
    if (open === false) {
      router.push('/login');
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/register`, {
      method: "POST", 
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        setShowModal(true);
      })
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <Alert title="Registro bem sucedido!" message="Você será redirecionado para a página de login" open={showModal} onOpenChange={handleAlertOpenChange}/>
      <div className="my-20">
        <h1 className="text-center font-bold text-xl">Essa é uma versão de teste do aplicativo!</h1>
        <p>Não garantimos a permanência dos dados na versão final do app</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col w-[350px] [&>input]:mb-2 mt-24">
        <Input onChange={(e) => setForm({...form, username: e.target.value})} placeholder="Nome de usuário"/>
        <Input onChange={(e) => setForm({...form, email: e.target.value})} placeholder="Email"/>
        <Input type="password" onChange={(e) => setForm({...form, password: e.target.value})} placeholder="Senha"/>
        <button className="bg-primary rounded-3xl px-4 py-2 w-fit mx-auto mt-4">Registrar usuário</button>
      </form>
    </div>
  )
}
