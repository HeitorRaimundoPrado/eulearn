"use client"

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Alert from '@/components/Alert';
import useGlobalStore from '@/stores/globalStore';

export default function Page() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: ""
  })

  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useGlobalStore((state) => [state.isLoggedIn, state.setIsLoggedIn]);

  const handleAlertOpenChange = (open: boolean) => {
    setShowModal(open)
    if (open === false) {
      router.push('/');
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/token`, {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
       'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        window.localStorage.setItem("access_token", data.access);
        window.localStorage.setItem("refresh_token", data.refresh);
        setShowModal(true)
        setIsLoggedIn(true)
      })
  }

  return (
    <div>
      <Alert title="Login bem sucedido!" message="Você será redirecionado para a home" open={showModal} onOpenChange={handleAlertOpenChange}/>
      <form onSubmit={handleSubmit} className="flex flex-col text-black">
        <input onChange={(e) => setForm({...form, username: e.target.value})}/>
        <input type="password" onChange={(e) => setForm({...form, password: e.target.value})}/>
        <button>Login</button>
      </form>
    </div>
  )
}
