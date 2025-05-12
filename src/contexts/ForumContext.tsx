"use client";
import type { ForumPost, ForumReply } from '@/types';
import React, { createContext, useState, ReactNode, useContext, useEffect, useCallback } from 'react';
import { getForumPosts as fetchPostsFromServer, addForumPost as addPostToServer, addForumReply as addReplyToServer } from '@/actions/forumActions';

interface ForumContextType {
  posts: ForumPost[];
  addPost: (newPostData: Omit<ForumPost, 'id' | 'creationDate' | 'replies'>) => Promise<{success: boolean; post?: ForumPost; error?: string}>;
  addReply: (postId: string, newReplyData: Omit<ForumReply, 'id' | 'postId' | 'creationDate'>) => Promise<{success: boolean; reply?: ForumReply; error?: string}>;
  isLoading: boolean;
  refreshForumData: () => Promise<void>;
}

export const ForumContext = createContext<ForumContextType | undefined>(undefined);

export const ForumProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const serverPosts = await fetchPostsFromServer();
      setPosts(serverPosts);
    } catch (error) {
      console.error("Failed to load forum posts:", error);
      setPosts([]); // Set to empty on error
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const addPost = async (newPostData: Omit<ForumPost, 'id' | 'creationDate' | 'replies'>) => {
    setIsLoading(true);
    const completePostData: ForumPost = {
        ...newPostData,
        id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        creationDate: new Date().toISOString(),
        replies: [] 
    };
    const result = await addPostToServer(completePostData);
    if (result.success && result.post) {
      await loadPosts(); // Re-fetch all posts
    } else {
      setIsLoading(false);
    }
    return result;
  };

  const addReply = async (postId: string, newReplyData: Omit<ForumReply, 'id' | 'postId' | 'creationDate'>) => {
    setIsLoading(true);
    const result = await addReplyToServer(postId, newReplyData);
    if (result.success && result.reply) {
     await loadPosts(); // Re-fetch all posts to update replies
    } else {
      setIsLoading(false);
    }
    return result;
  };

  const refreshForumData = async () => {
    await loadPosts();
  };

  return (
    <ForumContext.Provider value={{ posts, addPost, addReply, isLoading, refreshForumData }}>
      {children}
    </ForumContext.Provider>
  );
};

export const useForum = () => {
  const context = useContext(ForumContext);
  if (context === undefined) {
    throw new Error('useForum must be used within a ForumProvider');
  }
  return context;
};
