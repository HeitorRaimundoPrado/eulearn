"use client";

import { ChangeEvent } from 'react'

interface InputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  placeholder: string,
  className: string,
  type?: string
}

export default function Input({ onChange, placeholder, className, type="text" }: InputProps) {
  return (
    <input type={type} onChange={onChange} placeholder={placeholder} className={`p-2 rounded-md border-2 border-white border-opacity-[20%] bg-background px-4 outline-none focus:border-primary transition-all duration-200 ease-in-out ${className}`}/>
  )
}
