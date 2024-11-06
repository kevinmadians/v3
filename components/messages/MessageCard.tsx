'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Heart, Instagram, MessageCircle, Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Message, likeMessage, hasLikedMessage } from '@/lib/messages';

interface MessageCardProps {
  message: Message;
  hideActions?: boolean;
  hidePlayer?: boolean;
  className?: string;
  expanded?: boolean;
  largePlayer?: boolean;
}

export function MessageCard({ 
  message, 
  hideActions = false, 
  hidePlayer = false, 
  className,
  expanded = false,
  largePlayer = false
}: MessageCardProps) {
  const { toast } = useToast();
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState(message.likes);

  useEffect(() => {
    setHasLiked(hasLikedMessage(message.id));
  }, [message.id]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hasLiked) {
      likeMessage(message.id);
      setHasLiked(true);
      setLikes(prev => prev + 1);
    }
  };

  const getMessageUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/message/${message.id}`;
  };

  const shareMessage = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = getMessageUrl();
    const text = `Check out this message on For Bias`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Share Message',
          text: text,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyMessageUrl(e);
    }
  };

  const shareOnInstagram = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`https://instagram.com/stories/create`, '_blank');
  };

  const shareOnWhatsapp = (e: React.MouseEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(`Check out this message on For Bias: ${getMessageUrl()}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const copyMessageUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = getMessageUrl();
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link copied!",
        description: "The message link has been copied to your clipboard.",
        duration: 3000,
      });
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Please try copying the link manually.",
        variant: "destructive",
      });
    });
  };

  const CardWrapper = expanded ? 'div' : Link;
  const cardProps = expanded ? {} : { href: `/message/${message.id}` };

  return (
    <CardWrapper
      {...cardProps}
      className={cn(
        "bg-card h-full rounded-lg p-6 shadow-lg transition-all duration-300",
        !expanded && "hover:shadow-xl hover:-translate-y-1",
        "border border-border/40 hover:border-border/80",
        !expanded && "cursor-pointer",
        expanded && "p-8",
        className
      )}
    >
      <div className="mb-3 flex justify-between items-center">
        <p className={cn(
          "text-muted-foreground",
          expanded ? "text-base" : "text-sm"
        )}>
          To: {message.recipientName}
        </p>
        {!hideActions && (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLike}
                    className={cn(
                      "transition-colors duration-200",
                      hasLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'
                    )}
                  >
                    <Heart className={`h-5 w-5 ${hasLiked ? 'fill-current' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{likes} {likes === 1 ? 'like' : 'likes'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={shareMessage}
                      className="transition-colors duration-200"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={copyMessageUrl}
                      className="transition-colors duration-200"
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      
      <p className={cn(
        "font-reenie mb-6 text-foreground",
        expanded ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
        !expanded && "line-clamp-4"
      )}>
        {message.message}
      </p>
      
      <div className="mt-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className={cn(
            "relative flex-shrink-0",
            expanded ? "w-16 h-16" : "w-10 h-10"
          )}>
            <Image
              src={message.albumImage}
              alt={message.songName}
              fill
              className="rounded object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn(
              "font-medium truncate text-foreground",
              expanded ? "text-lg" : "text-sm"
            )}>
              {message.songName}
            </p>
            <p className={cn(
              "text-muted-foreground truncate",
              expanded ? "text-base" : "text-sm"
            )}>
              {message.artistName}
            </p>
          </div>
        </div>

        {(!hidePlayer || expanded) && (
          <iframe
            src={`https://open.spotify.com/embed/track/${message.songId}?theme=0`}
            width="100%"
            height={largePlayer ? "152" : "80"}
            frameBorder="0"
            allow="encrypted-media"
            className="rounded"
          />
        )}
      </div>
    </CardWrapper>
  );
}