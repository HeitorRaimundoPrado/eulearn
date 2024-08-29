"use client";

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { apiGet } from '@/utils/api'
import Subject from '@/interfaces/Subject'

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [privateCommunities, setPrivateCommunities] = useState([]);
  const [posts, setPosts] = useState({});

  useEffect(() => {
    apiGet("subjects")
    .then(data => {
      setSubjects(data)
      for (const subj of data) {
        apiGet(`posts/?subj=${subj.id}`)
          .then(p => setPosts(old =>  {
            return {...old,  [subj.id]: p.results  }
          }))
      }
    })
    .catch(err => alert(err))

    apiGet('communities/')
    .then(data => {
      setPrivateCommunities(data)
    })
      .catch(err => alert(err))

  }, [])


  useEffect(() => console.log(posts), [posts])


  return (
    <div className="[&_h2]:opacity-[80%] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:uppercase">
      <h2 >Disciplinas Oficiais</h2>
      <ul className="my-2 flex flex-col p-4">
        {
          subjects.map((subject, idx) => {
            return (
              <div className="flex flex-col">
                <Link key={subject.id} href={`/subject/${subject.id}`} className="mb-4 opacity-[60%] hover:text-primary hover:opacity-[100%] hover:underline transition-all ease-in-out duration-200">{subject.name}</Link>
                {
                  posts[subject.id] &&
                  posts[subject.id].map(post => {
                    return (
                      <Link key={post.id} href={`/subject/${subject.id}/forum/post/${post.id}`} className="mb-6 border-2 border-white rounded-md border-opacity-[20%] w-[80%] p-4">
                        <h3 className="font-bold mb-2 text-2xl">{post.title}</h3>
                        <p className="line-clamp-4 text-justify opacity-[60%]">{post.content}</p>
                      </Link>
                    )
                  })
                }
              </div>
            )
          })
        }
      </ul>

      <h2>Comunidades Não-Oficiais</h2>
      <div className="flex flex-col mt-4">
        <Link href="create-community" className="bg-primary rounded-md p-4 w-fit mb-6">Criar comunidade</Link>
        <ul>
          {
            privateCommunities.map(community => {
              return (
              <div className="flex flex-row">
                <Link key={community.id} href={`/community/${community.id}`} className="text-white-60 mr-4 hover:text-primary hover:opacity-[100%] hover:underline transition-all ease-in-out duration-200 mb-4">
                  {community.name}
                </Link>
                {
                  community.private &&
                    <p className="text-amber-400">Protegida por senha</p> ||
                    <p className="text-amber-400">Pública</p>
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
