import Link from 'next/link'

export default function NavBar({}) {
  return (
    <div className="flex flex-row w-full justify-end">
      <Link href={`/chat-messages`}>Mensagens</Link>
    </div>
  )
}
