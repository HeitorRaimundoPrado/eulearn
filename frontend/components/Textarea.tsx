export default function Textarea({ onChange, placeholder, className="" }) {
  return (
    <textarea onChange={onChange} placeholder={placeholder} className={`p-2 px-4 rounded-md border-2 border-white border-opacity-[20%] bg-background resize-none outline-none ${className}`}/>
  )
}
