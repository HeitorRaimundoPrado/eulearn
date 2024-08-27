import AddAnswerComponent from '@/components/AddAnswerComponent'
import Image from 'next/image'
import VoteButtons from '@/components/VoteButtons';
import AnswerActionsComponent from '@/components/AnswerActionsComponent';

type PageProps = {
  params: { name: string, post: string }
}

async function Answers({ answers }) {
  let answerProps = [];

  for (const ansId of answers) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/posts/${ansId}`, { cache: 'no-store' });
    const data = await res.json();
    answerProps.push(data);
    console.log(data)
  }

  return answerProps.map(ans => {
    return (
      <div className="ml-4 border-l-2 border-white-20  p-2 pb-0 w-full h-auto">
        <div className="w-6 h-6 bg-white-100 rounded-3xl mb-4"/>
        <p className="ml-2 mb-2">{ans.content}</p>

        <AnswerActionsComponent parent_post={ans.id} net_votes={ans.net_votes}/>
        <Answers answers={ans.answers}/>
      </div>
    )
  })
}

  export default async function Page({ params }: PageProps) {
  const { name, post } = params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/post/${post}`, { cache: 'no-store' } )
    const data = await res.json();

    return (
      <div className="w-full">
        <h1 className="font-bold text-2xl my-2">{data.title}</h1>
        <div className="flex flex-col mb-6 w-full">
          <p className="text-justify w-[70%]">{data.content}</p>
          {
            data.attachments.map(att => {
              return <img src={att.file} alt="Não foi possível carregar a imagem"/>
            })
          }
        </div>
        <VoteButtons post={data.id} net_votes={data.net_votes}/>
        <AddAnswerComponent className="mt-6" parent_post={post}  buttonClass="mb-4"/>
        <Answers answers={data.answers}/>
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
