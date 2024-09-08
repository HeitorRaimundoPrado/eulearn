import NewPostForm from '@/components/NewPostForm';

interface PageProps {
  params: {
    community_id: string;
  }
}

export default function Page({ params }: PageProps) {
  const community_id = parseInt(params.community_id)
  return (
     <NewPostForm is_private={true} community={community_id} subject={null}/> 
  )
}
