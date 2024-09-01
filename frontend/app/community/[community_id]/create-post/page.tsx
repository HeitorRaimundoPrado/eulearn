import NewPostForm from '@/components/NewPostForm';

export default function Page({ params }) {
  const { community_id } = params;
  return (
     <NewPostForm is_private={true} community={community_id}/> 
  )
}
