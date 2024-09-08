"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { apiPost } from '@/utils/api';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function Page() {
    const [newCommunity, setNewCommunity] = useState({
        name: "",
        description: "",
        private: false,
        password: ""
    })

    const handleCreateCommunity = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        apiPost('communities/', newCommunity)
            .then(data => alert("Comunidade criada com sucesso!"))
            .catch(err => alert("Houve um erro criando a comunidade"));
    }

    return (
        <div className="w-full flex justify-center">
            <div className='w-full sm:w-9/12 lg:w-7/12 flex flex-col pt-4'>
                <h2 className='text-2xl font-semibold pb-10 text-white-80'>
                    Criar comunidade
                </h2>
                <form onSubmit={handleCreateCommunity} className="w-full flex flex-col gap-5">
                    <Input placeholder="Nome da Comunidade" className="w-full text-sm" onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })} />

                    <Textarea placeholder="Descrição" className="w-full h-44 text-sm" onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })} />

                    <div className='flex flex-row items-center'>
                        <Label className='text-sm text-white-80'>Comunidade Privada </Label>
                        <Checkbox className="ml-6" onCheckedChange={(e) => setNewCommunity({ ...newCommunity, private: !newCommunity.private })} checked={newCommunity.private} />
                    </div>

                    {
                        newCommunity.private &&
                        <div className='w-full'>
                            <Input
                                type="password"
                                placeholder="Senha"
                                className="block w-full"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCommunity({ ...newCommunity, password: e.target.value })}
                            />
                            <span className='text-xs text-white-60'>Apenas usuários com senha terão acesso à comunidade</span>
                        </div>
                    }

                    <button className="w-44 bg-primary py-2 px-4 rounded-3xl mt-4 text-sm">Criar comunidade</button>
                </form>
            </div>
        </div>
    )
}
