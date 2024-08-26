"use client";

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { apiGet } from '@/utils/api'
import Subject from '@/interfaces/Subject'

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [privateCommunities, setPrivateCommunities] = useState([])

  useEffect(() => {
    apiGet("subjects")
    .then(data => {
      setSubjects(data)
    })
    .catch(err => alert(err))

    apiGet('communities/')
    .then(data => {
      setPrivateCommunities(data)
    })
      .catch(err => alert(err))

  }, [])


  return (
    <div className="[&_h2]:opacity-[80%] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:uppercase">
      <h2 >Disciplinas Oficiais</h2>
      <ul className="my-2 flex flex-col p-4">
        {
          subjects.map(subject => {
            return <Link key={subject.id} href={`/subject/${subject.id}`} className="mb-4 opacity-[60%] hover:text-primary-color hover:opacity-[100%] hover:underline transition-all ease-in-out duration-200">{subject.name}</Link>
          })
        }
      </ul>

      <h2>Comunidades Não-Oficiais</h2>
      <div className="flex flex-col mt-4">
        <Link href="create-community" className="bg-primary-color rounded-md p-4 w-fit">Criar comunidade</Link>
        <ul>
          {
            privateCommunities.map(community => {
              return (
              <div className="flex flex-row">
                <Link key={community.id} href={`/community/${community.id}`}>
                  {community.name}
                </Link>
                {
                  community.private &&
                    <p>Protegida por senha</p> ||
                    <p>Pública</p>
                }
              </div>
            )
            })
          }
        </ul>
      </div>
    </div>
  );
}
