import Link from 'next/link';
import type { ForumPost } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, UserCircle, CalendarDays } from 'lucide-react';

interface ForumPostCardProps {
  post: ForumPost;
}

const ForumPostCard = ({ post }: ForumPostCardProps) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader>
        <Link href={`/forum/${post.id}`} passHref>
          <CardTitle className="text-xl font-semibold hover:text-primary transition-colors cursor-pointer">{post.title}</CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{post.description}</p>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground flex justify-between items-center border-t pt-4 mt-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={`https://avatar.vercel.sh/${post.userName || post.userId}.png`} alt={post.userName} data-ai-hint="user avatar small" />
            <AvatarFallback>{post.userName ? post.userName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
          <span>{post.userName || 'Anonymous'}</span>
        </div>
        <div className="flex items-center space-x-4">
            <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                {new Date(post.creationDate).toLocaleDateString()}
            </div>
            {post.replies && post.replies.length > 0 && (
            <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                {post.replies.length}
            </div>
            )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ForumPostCard;
