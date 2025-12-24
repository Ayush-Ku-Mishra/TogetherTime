'use client';


import WatchMode from '@/app/components/watchMode';
import { useParams, useSearchParams } from 'next/navigation';

export default function WatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.roomId;
  const isHost = searchParams.get('host') === 'true';
  
  return <WatchMode roomId={roomId} isHost={isHost} />;
}