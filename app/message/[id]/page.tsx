import MessageView from '@/components/messages/MessageView';

export default function MessagePage({ params }: { params: { id: string } }) {
  return <MessageView id={params.id} />;
}