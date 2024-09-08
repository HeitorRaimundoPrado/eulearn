import Link from 'next/link';
import Post from '@/interfaces/Post';
import { RichText } from './TextEditor'

interface PostLinkProps {
  post: Post;
  href: string;
  className?: string
}

export default function PostLink({ post, href, className="" }: PostLinkProps) {
  console.log("content", post.content)
  console.log("content", JSON.parse(post.content))
  return (
    <Link key={post.id} href={href} className={`mb-6 border-2 border-white-20 rounded-md flex flex-col p-4${className}`}>
      <h3 className="font-bold mb-2 text-2xl">{post.title}</h3>
      <RichText className="line-clamp-4 ml-2 text-justify opacity-[60%]" value={JSON.parse(post.content)}/>
    </Link>
  )
}
