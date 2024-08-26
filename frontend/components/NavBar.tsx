import Link from 'next/link'

export default function NavBar() {
  return (
    <div className="flex flex-row w-full justify-end p-4 border-b-2 border-white border-opacity-[20%]">
      <div className="[&>*]:rounded-3xl [&>*]:py-2 [&>*]:px-4">
        <Link href="/login" className="border-[2px] border-white border-opacity-[20%]">Sign In</Link>
        <Link href="/register" className="bg-primary ml-6">Sign Up</Link>
      </div>
    </div>
  )
}
