import Link from 'next/link'
import Image from 'next/image'

export default function NavBar() {
    return (
        <div className="h-16 w-full flex flex-row justify-between items-center border-b-[1px] border-white-20 px-3">
            <div>
                <Image
                    src="/profile.png"
                    width={500}
                    height={500}
                    alt="Logo"
                />
            </div>

            <div className="[&>*]:rounded-3xl [&>*]:py-[6px] [&>*]:px-7 flex flex-row gap-3">

                <Link href="/login" className="text-sm border-[1px] border-white-20">
                    Sign In
                </Link>
                <Link href="/register" className="text-sm bg-primary-color">
                    Sign Up
                </Link>

            </div>
        </div>
    )
}
