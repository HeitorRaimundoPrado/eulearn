'use client';

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
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
    <div>
      <Alert title="Registro bem sucedido!" message="Você será redirecionado para a página de login" open={showModal} onOpenChange={handleAlertOpenChange}/>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input onChange={(e) => setForm({...form, username: e.target.value})}/>
        <input onChange={(e) => setForm({...form, email: e.target.value})}/>
        <input type="password" onChange={(e) => setForm({...form, password: e.target.value})}/>
        <button>Register User</button>
      </form>
    </div>
  )
}
