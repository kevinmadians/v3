'use client';

import { useEffect, useState } from 'react';
import { Message, getMessages } from '@/lib/messages';
import { MessageCard } from './MessageCard';
import { cn } from '@/lib/utils';

export function MarqueeMessages() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = () => {
    const allMessages = getMessages();
    if (allMessages.length === 0) return;
    
    const processedMessages = allMessages.map(msg => ({
      ...msg,
      createdAt: msg.createdAt || Date.now(),
      likes: msg.likes || 0
    }));
    
    const multipliedMessages = Array(6).fill(processedMessages).flat();
    setMessages(multipliedMessages);
  };

  if (messages.length === 0) return null;

  return (
    <div className="relative py-8 bg-background/50 backdrop-blur-sm border-y border-border">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none z-10" />
      
      <div className="flex flex-col gap-8">
        {/* First row - moving right */}
        <div className="flex flex-nowrap gap-6 animate-marquee-fast hover:[animation-play-state:paused] px-6">
          {messages.slice(0, Math.ceil(messages.length / 2)).map((message, idx) => (
            <div 
              key={`${message.id}-${idx}`} 
              className={cn(
                "flex-shrink-0 w-[400px]",
                "transition-all duration-300 hover:scale-[1.02] hover:z-20",
                "relative"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg" />
              <div className="relative h-[200px] overflow-hidden rounded-lg shadow-lg hover:shadow-xl border border-border/50">
                <MessageCard 
                  message={message} 
                  hidePlayer={true} 
                  hideActions={true}
                  className="border-none shadow-none hover:shadow-none hover:-translate-y-0"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Second row - moving left */}
        <div className="flex flex-nowrap gap-6 animate-marquee-reverse-fast hover:[animation-play-state:paused] px-6">
          {messages.slice(Math.ceil(messages.length / 2)).map((message, idx) => (
            <div 
              key={`${message.id}-${idx}`} 
              className={cn(
                "flex-shrink-0 w-[400px]",
                "transition-all duration-300 hover:scale-[1.02] hover:z-20",
                "relative"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg" />
              <div className="relative h-[200px] overflow-hidden rounded-lg shadow-lg hover:shadow-xl border border-border/50">
                <MessageCard 
                  message={message} 
                  hidePlayer={true} 
                  hideActions={true}
                  className="border-none shadow-none hover:shadow-none hover:-translate-y-0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}