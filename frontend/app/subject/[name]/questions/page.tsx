import Link from 'next/link'

async function getSubjId(name) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/subjects/?name=${name}`, { cache: "no-store" })
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

export default async function Page({ params }) {
  const { name } = params;

  const id = await getSubjId(name)
  const questions = await getQuestions(id)


  return (
    <div>
      <Link href={`/subject/${name}/create-question`}>Criar exercício</Link>
      {questions.map(question => (
        <Link href={`/subject/${name}/questions/${question.route}`}>
          <h2>{question.statement}</h2>
        </Link>
      ))}
    </div>
  )
}
