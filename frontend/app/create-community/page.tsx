"use client";

import { useState, useEffect } from 'react';
import { apiPost } from '@/utils/api';

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
    <div>
      <form onSubmit={handleCreateCommunity}>
        <div>
          <label>Nome:</label>
          <input type="text" onChange={(e) => setNewCommunity({...newCommunity, name: e.target.value})}/>
        </div>
        <div>
          <label>Descrição:</label>
          <textarea onChange={(e) => setNewCommunity({...newCommunity, description: e.target.value})}/>
        </div>
        <div>
          <label>Comunidade Privada (apenas usuários com senha tem acesso):</label>
          <input type="checkbox" onChange={(e) => setNewCommunity({...newCommunity, private: !newCommunity.private})} checked={newCommunity.private} />
        </div>
        {
          newCommunity.private &&
          <div>
            <label>Senha:</label>
            <input type="password" onChange={(e) => setNewCommunity({...newCommunity, password: e.target.value})}/>
          </div>
        }
        <button>Criar comunidade</button>
      </form>
    </div>
  )
}
