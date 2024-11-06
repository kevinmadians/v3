'use client';

import { useEffect, useState } from 'react';
import { Message, getMessage } from '@/lib/messages';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function MessageView({ id }: { id: string }) {
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    const foundMessage = getMessage(id);
    if (foundMessage) {
      setMessage(foundMessage);
    }
  }, [id]);

  if (!message) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground mb-4">Message not found.</p>
          <Button asChild>
            <Link href="/browse" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Browse Messages
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Button asChild variant="outline" className="mb-8">
            <Link href="/browse" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Browse
            </Link>
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl text-foreground mb-2">
              Hello, <span className="font-reenie">{message.recipientName}</span>
            </h1>
            <p className="text-muted-foreground">
              There&apos;s someone sending you a song, they want you to<br />
              hear this song that maybe you&apos;ll like :)
            </p>
          </div>
        </div>

        {/* Song Player Section */}
        <div className="bg-card rounded-lg p-6 shadow-lg mb-12">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={message.albumImage}
                alt={message.songName}
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-medium text-foreground mb-1">
                {message.songName}
              </h2>
              <p className="text-muted-foreground">
                {message.artistName}
              </p>
            </div>
          </div>
          
          <iframe
            src={`https://open.spotify.com/embed/track/${message.songId}?theme=0`}
            width="100%"
            height="152"
            frameBorder="0"
            allow="encrypted-media"
            className="rounded-lg"
          />
        </div>

        {/* Message Section */}
        <div className="text-center">
          <h3 className="text-lg text-muted-foreground mb-4">
            Also, here&apos;s a message from the sender:
          </h3>
          <p className="font-reenie text-4xl sm:text-5xl text-foreground mb-4">
            {message.message}
          </p>
          <p className="text-sm text-muted-foreground">
            Sent on {new Date(message.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Want to send a song to a friend?
          </p>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/submit">
              Send a song
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}