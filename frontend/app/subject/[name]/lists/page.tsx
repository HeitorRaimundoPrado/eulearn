"use client"

import Link from 'next/link'
import Test from '@/interfaces/Test'
import { useState, useEffect } from 'react';
import { apiGet } from '@/utils/api'

interface PageParams {
  params: {
    name: string;
  };
}

export default function Page({ params }: PageParams) {
  const { name } = params;

  const [subjId, setSubjId] = useState(null);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<Test[]>([])

  useEffect(() => {
    apiGet(`subject/${name}`)
    .then(data => {
      setSubjId(data.id)
      setLoading(false)
    })
    .catch(e => setErr(true))
  }, [])

  useEffect(() => {
    if (subjId !== null) {
      apiGet("tests/")
      .then(data => {
        setTests(data);
      })
    }
  }, [subjId])

  if (loading) {
    return (
      <div>loading...</div>
    )
  }

  if (err || subjId === null) {
    return (
      <div>Ocorreu um erro! Tem certeza de que você está na url correta?</div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <h1 className="uppercase mt-4 mb-4 font-bold">Listas de Exercícios</h1>
      <Link href={`/subject/${name}/create-list`} className="p-4 bg-primary rounded-xl my-6">Criar uma nova lista</Link>
      
      <ul>
        {
          tests.map(t => {
            return (
              <Link key={t.id} className="ease-in-out transition-all duration-200 text-white-80 hover:underline hover:text-primary ml-2" href={`/subject/${name}/test/${t.id}`}>{t.title}</Link>
            )}
          )
        }
      </ul>
    </div>
  )
}
