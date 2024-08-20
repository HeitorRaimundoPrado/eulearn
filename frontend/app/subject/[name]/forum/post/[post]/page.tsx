  import VoteButtons from './VoteButtons'

  type PageProps = {
    params: { name: string, post: string }
  }

  export default async function Page({ params }: PageProps) {
  const { name, post } = params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/posts/?url=${post}`, { cache: 'no-store' } )
  const data = await res.json();
  const postContent = data.results.length > 0 ? data.results[0] : undefined;

  return (
    <div>
     {
      postContent &&
      <>
      <h1>{postContent.title}</h1>
      <p>{postContent.content}</p>
      <VoteButtons post={postContent.id} net_votes={postContent.net_votes}/>
      </>
    }
    </div>
  )
}
