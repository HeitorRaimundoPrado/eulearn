"use client"

import { useState, useEffect, FormEvent } from 'react';
import { apiGet, apiPost } from '@/utils/api';
import Input from '@/components/Input';
import PostLink from '@/components/PostLink';
import Post from '@/interfaces/Post';
import Link from 'next/link';

interface JoinCommunityProps {
  communityId: number,
  successCallback: (data: any) => void
}

interface CommunityData {
  name: string;
  description: string;
  current_user_is_member: boolean;
}

function JoinCommunityForm ({ communityId, successCallback }: JoinCommunityProps) {
  const [password, setPassword] = useState("");

  const handleJoinCommunity = (e: FormEvent) => {
    e.preventDefault();
    apiPost(`join-community/${communityId}`, { password })
    .then(data => successCallback(data))
  }

  return (
    <form onSubmit={handleJoinCommunity} className="flex flex-col">
      <p className="text-amber-foreground mb-4">Essa comunidade é protegida por senha e você não faz parte dela ainda</p>
      <Input type="password" onChange={e => setPassword(e.target.value)} className="w-fit" placeholder="Senha da comunidade"/>
      <button className="w-fit bg-primary px-4 py-2 mt-8 rounded-md hover:opacity-[80%] transition-all ease-in-out duration-200">Entrar na comunidade</button>
    </form>
  )
}

interface PageProps {
  params: {
    community_id: string
  }
}

export default function Page({ params }: PageProps) {
  const { community_id } = params;

  const [community, setCommunity] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]> ([]);

  useEffect(() => {
    apiGet(`community/${community_id}/posts/`)
    .then(data => {
      console.log(data.results)
      setPosts(data.results)
    })

    apiGet(`community/${community_id}/`)
    .then(data => {
      setCommunity({...data})
      setLoading(false)
    });
  }, [community_id])

  useEffect(() => console.log(community), [community])

  const handleJoinCommunity = (data: CommunityData) => {
    console.log(data);
    setCommunity(data);
    alert("Você entrou na comunidade!");
  };

  if (loading || community === null) {
    return (
      <div>carregando...</div>
    )
  }

  const communityId = parseInt(community_id, 10);
  
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-2">{community.name}</h1>
      <p className="text-white-60 mb-10">{community.description}</p>
      {
        !community.current_user_is_member &&
          <JoinCommunityForm communityId={communityId} successCallback={handleJoinCommunity}/>
      }

      {
        community.current_user_is_member &&
        <>
          <Link href={`/community/${community_id}/create-post`} className="w-fit bg-primary px-4 py-2 mb-4 rounded-md mb-4">Criar Novo Post</Link>
            <ul className="list-none flex flex-col">
            {
              posts.map(p => <li className="w-[80%]" key={p.id}><PostLink href={`/community/${community_id}/post/${p.id}`} post={p}/></li>)
            }
          </ul>
          </>
      }
    </div>
  )
}
