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
    console.log(data)

    return (
      <div>
        <h1>{data.title}</h1>
        <p>{data.content}</p>
        {
          data.attachments.map(att => {
            console.log(att)
            console.log(att.file)
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
