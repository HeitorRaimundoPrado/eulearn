"use client"

import { useState, useEffect } from 'react';
import { apiGet } from '@/utils/api';
import NewPostForm from '@/components/NewPostForm';
import Link from 'next/link';

function JoinCommunityForm ({ communityId, successCallback }) {
  const [password, setPassword] = useState("");

  const handleJoinCommunity = (e) => {
    e.preventDefault();
    apiPost(`join-community/${communityId}`, { password })
    .then(data => successCallback(data))
  }

  return (
    <form onSubmit={handleJoinCommunity}>
      <p>Essa comunidade é protegida por senha e você não faz parte dela ainda</p>
      <input type="password" onChange={e => setPassword(e.target.value)}/>
      <button>Entrar na comunidade</button>
    </form>
  )
}

export default function Page({ params }) {
  const { community_id } = params;

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet(`community/${community_id}/`)
    .then(data => {
      setCommunity({...data, posts: data.posts ? data.posts : []})
      setLoading(false)
      });
    }, [])

  const handleJoinCommunity = (data) => {
    console.log(data)
    setCommunity(data);
    alert("Você entrou na comunidade!")
  }

  if (loading || community === null) {
    return (
      <div>carregando...</div>
    )
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{community.name}</h1>
      <p className="text-white-60 mb-10">{community.description}</p>
      {
        !community.current_user_is_member &&
          <JoinCommunityForm communityId={community_id} successCallback={handleJoinCommunity}/>
      }

      {
        community.current_user_is_member &&
        <>
          <Link href={`/community/${community_id}/create-post`} className="bg-primary px-4 py-2 mb-4 rounded-md">Criar Novo Post</Link>
          {
            community.posts.map(p => {
              return <>
                <Link href={`/community/${community_id}/post/${p.id}`}>
                <h2>{p.title}</h2>
                </Link>
              </>

            })
          }
          </>
      }
    </div>
  )
}
