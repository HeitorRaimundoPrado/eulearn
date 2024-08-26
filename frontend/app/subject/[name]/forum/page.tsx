import NewPostForm from '@/components/NewPostForm'
import Link from 'next/link'
import Post from '@/interfaces/Post'
import UserLinkContext from '@/components/UserLinkContext'

type PageProps = { 
  params: { name: string }
}
export default async function Page({ params }: PageProps) {
  const { name } = params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/posts?subj=${name}`, { cache: "no-store" })
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
    <div className="w-full p-10 pt-4">
      <NewPostForm is_private={false} subject={name}/>
      <ul className="mt-4">
        {
        latestPosts.map(post => { 
        return (
          <li key={post.id}>
            <Link href={`/subject/${name}/forum/post/${post.id}`} className="relative">
              <h2 className="font-bold text-2xl mb-2">{post.title}</h2>
              <p className="h-5 text-ellipsis w-[60%] h-[5.4rem] leading-[1.4rem] whitespace-normal overflow-hidden line-clamp-4 text-justify" >{post.content}</p>
            </Link>
            <div className="mt-4 flex flex-row items-center">
              <div className="w-6 h-6 rounded-3xl bg-white mr-4"/>
              <UserLinkContext username={post.author.username} id={post.author_id}/>
            </div>
          </li>
        )
        })}
      </ul>
    </div>
  )
}
