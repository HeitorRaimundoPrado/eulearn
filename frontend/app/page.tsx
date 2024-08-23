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
    <div>
      <h2>Disciplinas Oficiais</h2>
      <ul className="my-2">
        {
          subjects.map(subject => {
            return <Link key={subject.id} href={`/subject/${subject.id}`}>{subject.name}</Link>
          })
        }
      </ul>

      <h2>Comunidades Não-Oficiais</h2>
      <div>
        <Link href="create-community">Criar comunidade</Link>
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
