import NewPostForm from '@/components/NewPostForm'

export default function Page({ params }) {
  const { name } = params;

  return (
    <NewPostForm is_private={false} subject={name}/>
  )
}
