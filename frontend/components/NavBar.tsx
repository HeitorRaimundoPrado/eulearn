"use client";

import Link from 'next/link';
import Image from 'next/image';
import useGlobalStore from '@/stores/globalStore';
import { useState, useEffect } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiPost } from '@/utils/api';
import { useRouter } from 'next/navigation';
import Alert from '@/components/Alert';
import { HiOutlineMenuAlt2 } from "react-icons/hi";

import { useSidebar } from '@/context/MenuContext'

export default function NavBar() {
    const [hydrated, setHydrated] = useState(false);
    const [modal, setModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useGlobalStore((state) => [state.isLoggedIn, state.setIsLoggedIn]);
    const router = useRouter();
    const [isSideNavOpen, setIsSideNavOpen] = useState(false)

    const { toggleSidebar } = useSidebar()

    useEffect(() => {
        setHydrated(true)
    }, [])

    const handleLogout = () => {
        console.log("calling apiPost")
        apiPost('api/logout', { refresh_token: localStorage.getItem('refresh_token') }, false)
            .then((status) => {
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('access_token');
                setIsLoggedIn(false);
                setModal(true)
            })
    }

    const handleCloseModal = () => {
        setModal(false);
        router.push('/login')
    }

    
    const toggleSideNav = () => {
        setIsSideNavOpen(!isSideNavOpen)
    }

    return (
        <div className="h-16 w-full flex flex-row justify-between items-center border-b-[1px] border-white-20 px-3 py-3">
            <Alert title="Logout bem sucedido!" message="Você será redirecionado para a página de login!" open={modal} onOpenChange={handleCloseModal} />

            <div className="flex flex-row items-center justify-between gap-3 text-white-100">
                <Link href="/">
                    <Image
                        src="/favicon-32x32.png"
                        width={30}
                        height={30}
                        alt="Logo"
                    />
                </Link>

                <HiOutlineMenuAlt2 className='h-6 w-6 cursor-pointer block xl:hidden' onClick={toggleSidebar} />

            </div>

            {
                (hydrated && isLoggedIn) &&
                <DropdownMenu>
                    <DropdownMenuTrigger className="bg-white-100 w-8 h-8 rounded-3xl mr-4"></DropdownMenuTrigger>
                    <DropdownMenuContent className="mr-2 mt-3">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            }

            {
                (hydrated && !isLoggedIn) &&
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
