'use client';

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/Input'
import Alert from '@/components/Alert'

export default function Page() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    })

    const [showModal, setShowModal] = useState(false);

    const router = useRouter()

    const handleAlertOpenChange = (open: boolean) => {
        setShowModal(open)
        if (open === false) {
            router.push('/login');
        }
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/register`, {
            method: "POST",
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                setShowModal(true);
            })
    }

    return (
        <div className="w-full flex justify-center">
            <div className='w-full sm:w-9/12 lg:w-7/12 flex flex-col items-center pt-4 gap-20'>

                <Alert title="Registro bem sucedido!" message="Você será redirecionado para a página de login" open={showModal} onOpenChange={handleAlertOpenChange} />

                <div className="w-10/12 sm:w-8/12">
                    <h1 className="text-center text-2xl font-semibold text-white-80">
                        Essa é uma versão de teste do aplicativo!
                    </h1>
                    <p className="text-center text-sm font-semibold text-white-60">
                        Não garantimos a permanência dos dados na versão final do app
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-10/12 sm:w-8/12 flex flex-col gap-5">

                    <Input className="block w-full text-sm" onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Nome de usuário" />

                    <Input className="block w-full text-sm" onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />

                    <Input className="block w-full text-sm" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Senha" />

                    <Link href="/login" className='w-fit text-sm font-normal text-white-60  hover:text-primary'>
                        Já possui uma conta?
                    </Link>

                    <button className="w-full bg-primary rounded-3xl px-4 py-2 mx-auto mt-10 text-sm text-white-100">
                        Registrar usuário
                    </button>
                </form>
            </div>
        </div>
    )
}
