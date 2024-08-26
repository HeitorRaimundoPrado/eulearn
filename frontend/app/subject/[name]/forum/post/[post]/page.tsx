  import VoteButtons from '@/components/VoteButtons'
  import Image from 'next/image'

  type PageProps = {
    params: { name: string, post: string }
  }

  export default async function Page({ params }: PageProps) {
  const { name, post } = params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/post/${post}`, { cache: 'no-store' } )
    const data = await res.json();

    return (
      <div>
        <h1 className="font-bold text-2xl my-2">{data.title}</h1>
        <p className="text-justify w-[70%]">{data.content}</p>
        {
          data.attachments.map(att => {
            return <img src={att.file} alt="Não foi possível carregar a imagem"/>
          })
        }
        <VoteButtons post={data.id} net_votes={data.net_votes}/>
    </div>
    )
  }

  catch(err) {
    console.error(err)
    return (
      <div>
        <h1>Ocorreu um problema ao buscar esse post</h1>
        <p>Tem certeza de que a url está correta?</p>
      </div>
    )
  }
}
