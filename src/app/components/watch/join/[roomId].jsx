'use client';

import { useParams } from 'next/navigation';
import WatchMode from '../../watchMode';


export default function JoinWatchPage() {
  const params = useParams();
  const { roomId } = params;
  
  // This is always a guest
  const isHost = false;
  
  return <WatchMode roomId={roomId} initialIsHost={isHost} />;
}