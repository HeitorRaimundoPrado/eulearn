import NewPostForm from '@/components/NewPostForm'

interface PageParams {
  name: string;
}

export default function Page({ params }: { params: PageParams }) {
  const name = parseInt(params.name)

  return (
    <NewPostForm is_private={false} subject={name}/>
  )
}
