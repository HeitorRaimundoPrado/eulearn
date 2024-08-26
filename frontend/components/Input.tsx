"use client";

export default function Input({ onChange, placeholder, className }) {
  return (
    <input onChange={onChange} placeholder={placeholder} className={`p-2 rounded-md border-2 border-white border-opacity-[20%] bg-background px-4 outline-none ${className}`}/>
  )
}
