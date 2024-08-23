"use client"

import Link from 'next/link'
import Test from '@/interafaces/Test'
import { useState, useEffect } from 'react';
import { apiGet } from '@/utils/api'

export default  function Page({ params }) {
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
    <div>
      <Link href={`/subject/${name}/create-list`}>Criar uma nova lista</Link>
      
      {
        tests.map(t => {
          return (
            <Link key={t.id} href={`/subject/${name}/test/${t.id}`}>{t.title}</Link>
          )}
        )
      }
    </div>
  )
}
