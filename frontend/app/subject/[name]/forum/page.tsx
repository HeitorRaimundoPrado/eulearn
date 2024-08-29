import Link from 'next/link'
import Post from '@/interfaces/Post'
import UserLinkContext from '@/components/UserLinkContext'
import apiServer from '@/utils/apiServer'

type PageProps = { 
  params: { name: string }
}
export default async function Page({ params }: PageProps) {
  const { name } = params;
  const db = apiServer();
  const latestPosts: Post[] = await db.posts.getAuthors(await db.posts.filter(name));
  console.log(latestPosts)

  return (
    <div className="w-full p-10 pt-4">
      <Link href={`/subject/${name}/forum/create-post`} className="border-2 border-white-20 p-[12px] rounded-3xl">Criar nova publicação +</Link>
      <ul className="mt-8">
        {
          latestPosts.map(post => { 
          return (
            <li key={post.id}>
              <Link href={`/subject/${name}/forum/post/${post.id}`} className="relative">
                <h2 className="font-bold text-2xl mb-2">{post.title}</h2>
                <p className="h-5 text-ellipsis w-[60%] h-[5.4rem] leading-[1.4rem] whitespace-normal overflow-hidden line-clamp-4 text-justify" >{post.content}</p>
              </Link>
              <div className="mt-4 flex flex-row items-center">
                <div className="w-6 h-6 rounded-3xl bg-white-100 mr-4"/>
                <UserLinkContext username={post.author.username} id={post.author_id}/>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
