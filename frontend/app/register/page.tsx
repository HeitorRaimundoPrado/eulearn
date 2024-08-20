'use client';

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  })

  const router = useRouter()

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
        if (res.ok) {
          router.push("/login")
        }
      })
  }
  return (
    <div>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input onChange={(e) => setForm({...form, username: e.target.value})}/>
        <input onChange={(e) => setForm({...form, email: e.target.value})}/>
        <input type="password" onChange={(e) => setForm({...form, password: e.target.value})}/>
        <button>Register User</button>
      </form>
    </div>
  )
}
