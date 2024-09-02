import { IoMdAttach } from 'react-icons/io';
import { ChangeEvent } from 'react'

type FileInputProps = {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function FileInput({ onChange, className=""}: FileInputProps) {
  return (
    <div className={className}>
      <label  htmlFor="file-input"><IoMdAttach className="h-auto w-8 hover:cursor-pointer"/></label>
      <input type="file" onChange={onChange} className="hidden" id="file-input"/>
    </div>
  )
}
