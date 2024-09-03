import Link from 'next/link'

interface Subject {
  id: number;
}

async function getSubjId(name: number): Promise<Subject | undefined> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/subject/${name}`, { cache: "no-store" })
  const data  = await res.json();
  if (data.length === 1) {
    return data[0];
  }
}

interface Question {
  id: number;
  statement: string;
}

async function getQuestions(id: number): Promise<Question[]> {
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

  const subject = await getSubjId(name)

  if (!subject) {
    return (
      <div>
        <p>No subject found.</p>
      </div>
    );
  }

  const questions = await getQuestions(subject.id)


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
