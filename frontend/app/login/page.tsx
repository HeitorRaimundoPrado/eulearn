"use client"

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import Alert from '@/components/Alert';
import Input from '@/components/Input';
import useGlobalStore from '@/stores/globalStore';

export default function Page() {
    const router = useRouter();
    const [form, setForm] = useState({
        username: "",
        password: ""
    })

    const [showModal, setShowModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useGlobalStore((state) => [state.isLoggedIn, state.setIsLoggedIn]);

    const handleAlertOpenChange = (open: boolean) => {
        setShowModal(open)
        if (open === false) {
            router.push('/');
        }
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/token`, {
            method: "POST",
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                window.localStorage.setItem("access_token", data.access);
                window.localStorage.setItem("refresh_token", data.refresh);
                setShowModal(true)
                setIsLoggedIn(true)
            })
    }

    return (
        <div className="w-full flex justify-center">
            <div className='w-full sm:w-9/12 lg:w-7/12 flex flex-col items-center pt-4 gap-20'>

                <Alert title="Login bem sucedido!" message="Você será redirecionado para a home" open={showModal} onOpenChange={handleAlertOpenChange} />

                <div className="w-10/12 sm:w-8/12">
                    <h1 className="text-center text-2xl font-semibold text-white-80">
                        Essa é uma versão de teste do aplicativo!
                    </h1>
                    <p className="text-center text-sm font-semibold text-white-60">
                        Não garantimos a permanência dos dados na versão final do app
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-10/12 sm:w-8/12 flex flex-col gap-5">
                    <Input onChange={(e) => setForm({ ...form, username: e.target.value })} className="block w-full text-sm"placeholder="Email" />

                    <Input type="password" className="block w-full text-sm" onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Senha" />

                    <Link href="/register" className='w-fit text-sm font-normal text-white-60  hover:text-primary'>
                        Primeira vez usando Eulearn?
                    </Link>

                    <button className="w-full bg-primary rounded-3xl px-4 py-2 mx-auto mt-10 text-sm text-white-100">
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}
