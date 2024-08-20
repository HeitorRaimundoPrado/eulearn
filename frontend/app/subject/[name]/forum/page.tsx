import NewPostForm from './NewPostForm'
import Link from 'next/link'
import Post from '@/interfaces/Post'

type PageProps = { 
  params: { name: string }
}
export default async function Page({ params }: PageProps) {
  const { name } = params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/posts`, { cache: "no-store" })
  const data = await res.json();
  const latestPosts: Post[] = data.results;

  return (
    <div>
      <NewPostForm/>
      <ul>
        {
        latestPosts.map(post => { 
        return <li key={post.id}><Link href={`/subject/${name}/forum/post/${post.route}`}>
            <h2>{post.title}</h2>
            <p className="h-5 overflow-ellipsis" >{post.content}</p>
          </Link></li>
        })}
      </ul>
    </div>
  )
}
