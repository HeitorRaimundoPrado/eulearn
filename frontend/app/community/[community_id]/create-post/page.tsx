import NewPostForm from '@/components/NewPostForm';

export default function Page({ community_id }) {
  return (
     <NewPostForm is_private={true} community={community_id}/> 
  )
}
