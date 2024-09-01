"use client"

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Alert from '@/components/Alert';
import Input from '@/components/Input';
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
    <div className="w-full h-full flex flex-col items-center">
      <Alert title="Login bem sucedido!" message="Você será redirecionado para a home" open={showModal} onOpenChange={handleAlertOpenChange}/>

      <div className="my-20">
        <h1 className="text-center font-bold text-xl">Essa é uma versão de teste do aplicativo!</h1>
        <p>Não garantimos a permanência dos dados na versão final do app</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col w-[350px] [&>input]:mb-2 mt-24 text-black">
        <Input onChange={(e) => setForm({...form, username: e.target.value})} placeholder="Email"/>
        <Input type="password" onChange={(e) => setForm({...form, password: e.target.value})} placeholder="Senha"/>
        <button className="bg-primary rounded-3xl px-4 py-2 w-fit mx-auto mt-4">Login</button>
      </form>
    </div>
  )
}
