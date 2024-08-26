import Link from 'next/link';

type PageProps = {
  params: {
    name: string
  }
}

export default async function Page({ params }: PageProps) {
  const { name } = params;

  const subj = await (await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/subject/${name}`)).json();

  const posts = (await (await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/posts/?subj=${name}`)).json()).results;

  console.log(posts)

  return (
    <div>
      <div className="[&_h2]:font-bold [&_h2]:uppercase [&>*]:mb-6">
        <h1 className="font-bold text-2xl uppercase">{subj.name}</h1>
        <div>
          <h2><Link href={`/subject/${name}/forum`}>Fórum Principal</Link></h2>
          {
            posts.map(post => {
              return (
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                </div>
              )
            })
          }
        </div>
        <div>
          <h2><Link href={`/subject/${name}/social`}>Fórum Social</Link></h2>
        </div>
        <div>
          <h2><Link href={`/subject/${name}/lists`}>Listas de Exercicios</Link></h2>
        </div>
        <div>
          <h2><Link href={`/subject/${name}/questions`}>Exercícios Avulsos</Link></h2>
        </div>
      </div>
    </div>
  )
}
