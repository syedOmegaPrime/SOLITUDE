import type { ForumPost as ForumPostType } from '@/types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ForumPostDetails from '@/components/forum/ForumPostDetails'; // New component
import { mockForumPosts } from '@/data/mockData'; // This will be empty initially

// This function is still needed for generateStaticParams if using SSG for posts,
// but with dynamic localStorage data, it might make more sense to fetch on demand.
// For now, if mockForumPosts is empty, this will generate no static pages, which is fine.
export async function generateStaticParams() {
  // In a real app with a DB, you'd fetch IDs here.
  // With localStorage, static generation of these dynamic detail pages is tricky.
  // We'll keep it for now, but it will only work if mockForumPosts has initial data.
  // If posts are purely dynamic from localStorage, this won't pre-render them.
  return mockForumPosts.map(post => ({ // mockForumPosts will be empty
    postId: post.id,
  }));
}

// This function would ideally fetch from a context or API if data is fully dynamic.
// For this setup, we'll pass the ID to a client component that uses the context.
async function getPostStaticInfo(id: string): Promise<Partial<ForumPostType> | undefined> {
  // This function is mainly for metadata. It can attempt to find from mock (empty)
  // or have a fallback. A better approach for fully dynamic content would be
  // to not use generateMetadata if the source is purely client-side context.
  // However, Next.js expects it for dynamic segments if not using client-side fetching for metadata.
  const post = mockForumPosts.find(p => p.id === id); // Will likely be undefined
  if (post) {
    return { title: post.title, description: post.description };
  }
  return undefined; // Fallback for dynamic posts
}


export async function generateMetadata({ params }: { params: { postId: string }}) {
  const postInfo = await getPostStaticInfo(params.postId);
  if (!postInfo || !postInfo.title) { // Check if postInfo or title is undefined
    return { 
        title: 'Forum Post - SOLITUDE',
        description: 'View the discussion on this forum post.'
    };
  }
  return {
    title: `${postInfo.title} - Forum - SOLITUDE`,
    description: (postInfo.description || '').substring(0,150) + "...",
  };
}


export default function ForumPostPage({ params }: { params: { postId: string }}) {
  // The actual fetching and display logic will be in ForumPostDetails client component
  // which can access the ForumContext.
  // We pass postId to it.

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <Link href="/forum" className="inline-flex items-center text-sm text-primary hover:underline group mb-4">
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Forum
      </Link>
      <ForumPostDetails postId={params.postId} />
    </div>
  );
}
