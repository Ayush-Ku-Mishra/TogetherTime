'use client';

import { useParams, useSearchParams } from 'next/navigation';
import WatchMode from '../watchMode';

export default function WatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { roomId } = params;
  
  // If guest=true, user is NOT a host
  // Otherwise, they are a host
  const isGuest = searchParams.get('guest') === 'true';
  const isHost = !isGuest;
  
  return <WatchMode roomId={roomId} initialIsHost={isHost} />;
}