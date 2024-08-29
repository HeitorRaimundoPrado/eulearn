"use client";

import Link from 'next/link';
import Image from 'next/image';
import useGlobalStore from '@/stores/globalStore';
import { useState, useEffect } from 'react';

export default function NavBar() {
    const [hydrated, setHydrated] = useState(false);
    const isLoggedIn = useGlobalStore((state) => state.isLoggedIn);

    useEffect(() => {
      setHydrated(true)
    }, [])

    return (
        <div className="h-16 w-full flex flex-row justify-between items-center border-b-[1px] border-white-20 px-3">
            <div className="text-white-100">
                <Image
                    src="/profile.png"
                    width={40}
                    height={30}
                    alt="Logo"
                />
            </div>

            {
              hydrated && 
                isLoggedIn &&
                <div className="bg-white-100 w-8 h-8 rounded-3xl mr-4"/>
                ||
                <div className="[&>*]:rounded-3xl [&>*]:py-[6px] [&>*]:px-7 flex flex-row gap-3">
                    <Link href="/login" className="text-sm border-[1px] border-white-20">
                        Sign In
                    </Link>
                    <Link href="/register" className="text-sm bg-primary">
                        Sign Up
                    </Link>

                </div>
            }
        </div>
    )
}
