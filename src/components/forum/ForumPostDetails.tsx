"use client";

import { useEffect, useState } from 'react';
import type { ForumPost, ForumReply, User } from '@/types';
import { useForum } from '@/contexts/ForumContext';
import { useAuth } from '@/hooks/useAuth';
import { CalendarDays, MessageSquare, Send, Loader2 as LucideLoader } from 'lucide-react'; // Renamed Loader2 to avoid conflict
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link'; 

interface ForumPostDetailsProps {
  postId: string;
}

export default function ForumPostDetails({ postId }: ForumPostDetailsProps) {
  const { posts, addReply, isLoading: forumLoading, refreshForumData } = useForum();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    if (!forumLoading) {
        const foundPost = posts.find(p => p.id === postId);
        if (foundPost) {
          setPost(foundPost);
        }
    }
  }, [posts, postId, forumLoading]);

  const handleReplySubmit = async () => {
    if (!user) {
      toast({ title: "Not Logged In", description: "You need to be logged in to reply.", variant: "destructive" });
      return;
    }
    if (!replyContent.trim()) {
      toast({ title: "Empty Reply", description: "Reply content cannot be empty.", variant: "destructive" });
      return;
    }

    setIsSubmittingReply(true);
    
    const replyData: Omit<ForumReply, 'id' | 'postId' | 'creationDate'> = {
      userId: user.id,
      userName: user.name || user.email.split('@')[0],
      content: replyContent,
    };

    const result = await addReply(postId, replyData);

    setIsSubmittingReply(false);

    if (result.success) {
        setReplyContent('');
        toast({ title: "Reply Submitted", description: "Your reply has been added." });
        await refreshForumData(); // Refresh data to get latest replies including the new one
         // Re-fetch the post to update replies list, or rely on context update if optimistic
        const updatedPosts = await fetchPostsFromServer(); // Assuming fetchPostsFromServer is available or from context
        const reFoundPost = updatedPosts.find(p => p.id === postId);
        if (reFoundPost) setPost(reFoundPost);

    } else {
        toast({ title: "Reply Failed", description: result.error || "Could not submit reply.", variant: "destructive" });
    }
  };

  if (forumLoading || authLoading) {
    return (
        <>
            <Skeleton className="h-24 w-full mb-2" /> 
            <Skeleton className="h-32 w-full mb-6" /> 
            <Separator />
            <Skeleton className="h-10 w-1/3 my-6" /> 
            <Skeleton className="h-20 w-full mb-4" /> 
            <Skeleton className="h-20 w-full mb-6" /> 
             <Card className="mt-8 shadow-lg">
                <CardHeader>
                    <Skeleton className="h-6 w-1/4 mb-1"/>
                    <Skeleton className="h-4 w-1/2"/>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-24 w-full"/>
                    <Skeleton className="h-10 w-32"/>
                </CardContent>
            </Card>
        </>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold text-destructive">Post Not Found</h1>
        <p className="mt-4 text-muted-foreground">This forum post does not exist or may have been removed.</p>
      </div>
    );
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-foreground">{post.title}</CardTitle>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-1.5">
                  <AvatarImage src={`https://avatar.vercel.sh/${post.userName || post.userId}.png`} alt={post.userName || 'User'} data-ai-hint="user avatar small"/>
                  <AvatarFallback>{post.userName ? post.userName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <span>{post.userName || 'Anonymous'}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5" />
              <span>{new Date(post.creationDate).toLocaleDateString()}</span>
            </div>
             <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1.5" />
                <span>{post.replies?.length || 0} Replies</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{post.description}</p>
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Replies ({post.replies?.length || 0})</h2>
        {post.replies && post.replies.length > 0 ? (
          <div className="space-y-6">
            {post.replies.map((reply: ForumReply) => (
              <Card key={reply.id} className="bg-secondary/30 shadow-md">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://avatar.vercel.sh/${reply.userName || reply.userId}.png`} alt={reply.userName || 'User'} data-ai-hint="user avatar small"/>
                            <AvatarFallback>{reply.userName ? reply.userName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-foreground">{reply.userName || 'Anonymous'}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(reply.creationDate).toLocaleString()}</span>
                    </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90 whitespace-pre-wrap">{reply.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No replies yet. Be the first to respond!</p>
        )}
      </div>
      
      <Card className="mt-8 shadow-lg">
        <CardHeader>
            <CardTitle className="text-xl">Leave a Reply</CardTitle>
            {!user && <CardDescription>You need to be <Link href={`/login?redirect=/forum/${postId}`} className="text-primary hover:underline">logged in</Link> to reply.</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">
            <Textarea 
                placeholder={user ? "Write your reply here..." : "Login to write a reply..."}
                className="min-h-[100px]" 
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                disabled={!user || isSubmittingReply} 
            />
            <Button 
                onClick={handleReplySubmit}
                disabled={!user || isSubmittingReply || !replyContent.trim()} 
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
                {isSubmittingReply ? <LucideLoader className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4"/>}
                Submit Reply
            </Button>
        </CardContent>
      </Card>
    </>
  );
}

// Helper function, assuming fetchPostsFromServer is defined in forumActions.ts
// This is a placeholder for how you might re-fetch data if not relying on optimistic updates.
async function fetchPostsFromServer() {
    // This should call your actual server action, e.g., `getForumPosts()`
    // For now, returning empty array as placeholder.
    // In a real scenario:
    // import { getForumPosts } from '@/actions/forumActions';
    // return await getForumPosts();
    return [] as ForumPost[];
}
