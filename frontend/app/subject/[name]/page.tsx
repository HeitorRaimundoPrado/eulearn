import Link from 'next/link';

type PageProps = {
  params: {
    name: string
  }
}

export default function Page({ params }: PageProps) {
  const { name } = params;
  return (
    <div>
      <ul>
        <li><Link href={`/subject/${name}/forum`}>Fórum Principal</Link></li>
        <li><Link href={`/subject/${name}/social`}>Fórum Social</Link></li>
        <li><Link href={`/subject/${name}/lists`}>Listas de Exercicios</Link></li>
        <li><Link href={`/subject/${name}/exercises`}>Exercícios Avulsos</Link></li>
      </ul>
    </div>
  )
}
