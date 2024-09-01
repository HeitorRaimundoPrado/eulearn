import Link from 'next/link'

async function getSubjId(name) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/subject/${name}`, { cache: "no-store" })
  const data  = await res.json();
  if (data.length === 1) {
    return data[0];
  }
}

async function getQuestions(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/questions/?subject=${id}`, { cache: "no-store" })
  const data = await res.json();
  return data;
}

interface PageProps {
  params: {
    name: number,
  }
}

export default async function Page({ params }: PageProps) {
  const { name } = params;

  const id = await getSubjId(name)
  const questions = await getQuestions(id)


  return (
    <div>
      <Link href={`/subject/${name}/create-question`}>Criar exercício</Link>
      {questions.map(question => (
        <Link href={`/subject/${name}/questions/${question.id}`} key={question.id}>
          <h2>{question.statement}</h2>
        </Link>
      ))}
    </div>
  )
}
