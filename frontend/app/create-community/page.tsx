"use client";

import { useState, useEffect } from 'react';
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

  const handleCreateCommunity = (e) => {
    e.preventDefault();
    apiPost('communities/', newCommunity)
    .then(data => alert("Comunidade criada com sucesso!"))
    .catch(err => alert("Houve um erro criando a comunidade"));
  }

  return (
    <div className="w-full">
      <form onSubmit={handleCreateCommunity} className="[&>div]:w-[60%] [&>*]:mb-4">
        <div>
          <Input placeholder="Nome da Comunidade" className="w-full" onChange={(e) => setNewCommunity({...newCommunity, name: e.target.value})}/>
        </div>
        <div>
          <Textarea placeholder="Descrição" className="w-full h-44" onChange={(e) => setNewCommunity({...newCommunity, description: e.target.value})}/>
        </div>
        <div className="flex flex-row items-center">
          <Label>Comunidade Privada (apenas usuários com senha tem acesso):</Label>
          <Checkbox className="ml-6" onCheckedChange={(e) => setNewCommunity({...newCommunity, private: !newCommunity.private})} checked={newCommunity.private}/>
        </div>
        {
          newCommunity.private &&
          <div>
            <Input type="password" placeholder="Senha" onChange={(e) => setNewCommunity({...newCommunity, password: e.target.value})}/>
          </div>
        }
        <button className="w-content bg-primary py-2 px-4 rounded-3xl mt-4">Criar comunidade</button>
      </form>
    </div>
  )
}
