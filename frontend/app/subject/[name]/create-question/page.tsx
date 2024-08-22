"use client";

import { useEffect, useState } from 'react';
import { apiPost, apiGet } from '@/utils/api';
import Answer from '@/interfaces/Answer';

export default function Page({ params }) {
  const { name } = params;

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet(`subjects/?name=${name}`)
    .then(result => {
      if (result.length === 0)  {
        alert("Você está acessando uma página não existente")
        return;
      }

      setSubject(result[0].id);
      setLoading(false);
    })
  }, [])


  if (loading || subject === null) {
    return (
      <div>loading...</div>
    )
  }

  return (
    <div>
      <CreateQuestion subjId={subject} callbackCreateQuestion={() => alert("Questão criada com sucesso")}/>
    </div>
  )
}
