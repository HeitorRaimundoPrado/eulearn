"use client";

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { apiGet } from '@/utils/api'
import Subject from '@/interfaces/Subject'


interface Post {
  id: number;
  title: string;
  content: string;
}

interface Community {
  id: number;
  name: string;
  private: boolean;
}

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [privateCommunities, setPrivateCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<{ [key: number]: Post[] }>({});

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
              <div className="flex flex-col" key={idx}>
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
              <div className="flex flex-row" key={community.id}>
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
        <div className="my-4">
          <h2 className="mb-4">Disclaimer de Teste</h2>

          <p>Esta é uma versão de testes do aplicativo, e todos os dados inseridos ou gerados durante o uso estão sujeitos a serem apagados ou modificados a qualquer momento, sem aviso prévio. Isso inclui, mas não se limita a, dados de cadastro, mensagens, posts, arquivos anexados e qualquer outro conteúdo fornecido ou criado pelos usuários.</p>

          <p>A finalidade desta versão é a realização de testes de funcionalidade, desempenho e segurança. Portanto, não recomendamos o uso deste aplicativo para fins críticos ou armazenamento de informações sensíveis.</p>

          <p>Ao utilizar esta versão de testes, você reconhece e concorda que:</p>

          <ul className="list-disc ml-6 pt-4">
            <li><p>Não há garantia de retenção ou segurança dos dados.</p></li>
            <li><p>Nenhum suporte ou recuperação de dados será fornecido caso ocorra a perda de dados.</p></li>
            <li><p>O uso do aplicativo é feito por sua própria conta e risco.</p></li>


          </ul>
          <p className="mt-2">Obrigado por contribuir para o desenvolvimento e aprimoramento do nosso aplicativo!</p>
        </div>
      </div>
    </div>
  );
}
