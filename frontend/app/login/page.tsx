"use client"

import {useState} from "react"

export default function Page() {
  const [form, setForm] = useState({
    username: "",
    password: ""
  })

  const handleSubmit = (e) => {
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
      })
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col text-black">
        <input onChange={(e) => setForm({...form, username: e.target.value})}/>
        <input type="password" onChange={(e) => setForm({...form, password: e.target.value})}/>
        <button>Login</button>
      </form>
    </div>
  )
}
