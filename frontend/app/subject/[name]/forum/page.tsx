import NewPostForm from './NewPostForm'
import Link from 'next/link'
import Post from '@/interfaces/Post'
import UserLinkContext from '@/components/UserLinkContext'

type PageProps = { 
  params: { name: string }
}
export default async function Page({ params }: PageProps) {
  const { name } = params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/posts`, { cache: "no-store" })
  const data = await res.json();
  const latestPosts: Post[] = await Promise.all(data.results.map(async p => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/user/${p.author_id}`)
    const user = await res.json();
    return {
      ...p,
      author: user
    }
  }));
  console.log(latestPosts)

  return (
    <div>
      <NewPostForm/>
      <ul>
        {
        latestPosts.map(post => { 
        return <li key={post.id}><Link href={`/subject/${name}/forum/post/${post.id}`}>
            <h2>{post.title}</h2>
            <p className="h-5 overflow-ellipsis" >{post.content}</p>
          </Link>
          <UserLinkContext username={post.author.username} id={post.author_id}/>
          </li>
        })}
      </ul>
    </div>
  )
}
