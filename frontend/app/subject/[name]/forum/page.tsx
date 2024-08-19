import NewPostForm from './newPostForm.tsx'
import Link from 'next/link'

export default async function Page({ params }) {
  const { name } = params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/posts`, { cache: "no-store" })
  const data = await res.json();
  const latestPosts = data.results;

  return (
    <div>
      <NewPostForm/>
      <ul>
        {latestPosts.map(post =>  <li><Link href="/helloworld">{post.title}</Link></li>)}
      </ul>
    </div>
  )
}
