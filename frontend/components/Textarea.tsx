import { ChangeEvent } from 'react';

interface TextareaProps {
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void,
  placeholder?: string,
  className: string,
}

export default function Textarea({ onChange, placeholder, className="" }: TextareaProps) {
  return (
    <textarea onChange={onChange} placeholder={placeholder} className={`p-2 px-4 rounded-md border-2 border-white border-opacity-[20%] bg-background resize-none outline-none focus:border-primary transition-all duration-200 ease-in-out ${className}`}/>
  )
}
