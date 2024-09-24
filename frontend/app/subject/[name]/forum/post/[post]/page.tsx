"use client";
import AddAnswerComponent from '@/components/AddAnswerComponent'
import { RichText } from '@/components/TextEditor';
import VoteButtons from '@/components/VoteButtons';
import AnswerActionsComponent from '@/components/AnswerActionsComponent';

type PageProps = {
  params: { name: string, post: string }
}

type AnswersProps = {
  answers: string[];
}

interface Attachment {
  file: string;
}

async function Answers({ answers }: AnswersProps) {
  let answerProps = [];

  for (const ansId of answers) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/posts/${ansId}`, { cache: 'no-store' });
    const data = await res.json();
    answerProps.push(data);
    console.log(data)
  }

  return answerProps.map(ans => {
    return (
      <div className="ml-4 border-l-2 border-white-20  p-2 pb-0 w-full h-auto" key={ans.id}>
        <div className="w-6 h-6 bg-white-100 rounded-3xl mb-4" />
        <p className="ml-2 mb-2">{ans.content}</p>

        <AnswerActionsComponent parentPost={ans.id} netVotes={ans.net_votes} />
        <Answers answers={ans.answers} />
      </div>
    )
  })
}

export default async function Page({ params }: PageProps) {
  const { name } = params;
  const post = parseInt(params.post)

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/post/${post}`, { cache: 'no-store' })
    const data = await res.json();

    return (
      <div className="w-full">
        <h1 className="font-bold text-2xl my-2">{data.title}</h1>
        <div className="flex flex-col mb-6 w-full">
          <RichText value={JSON.parse(data.content)} withImages={true} />
        </div>
        <VoteButtons post={data.id} className='block' net_votes={data.net_votes} />
        <AddAnswerComponent className="mt-6" parent_post={post} buttonClass="mb-4" />
        <Answers answers={data.answers} />
      </div>
    )
  }

  catch (err) {
    console.error(err)
    return (
      <div>
        <h1>Ocorreu um problema ao buscar esse post</h1>
        <p>Tem certeza de que a url está correta?</p>
      </div>
    )
  }
}
