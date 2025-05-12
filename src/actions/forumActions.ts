'use server';
import { getDb } from '@/lib/db';
import type { ForumPost, ForumReply } from '@/types';

export async function getForumPosts(): Promise<ForumPost[]> {
  const db = getDb();
  try {
    const postsStmt = db.prepare('SELECT * FROM forum_posts ORDER BY creationDate DESC');
    let posts = postsStmt.all() as ForumPost[];

    const repliesStmt = db.prepare('SELECT * FROM forum_replies WHERE postId = ? ORDER BY creationDate ASC');
    
    posts = posts.map(post => {
      const repliesForPost = repliesStmt.all(post.id) as ForumReply[];
      return { ...post, replies: repliesForPost || [] };
    });
    return posts;
  } catch (error: any) {
    console.error('Error fetching forum posts:', error);
    return [];
  }
}

export async function addForumPost(postData: ForumPost): Promise<{ success: boolean; post?: ForumPost; error?: string }> {
  const db = getDb();
  try {
    const insertStmt = db.prepare(
      'INSERT INTO forum_posts (id, title, description, userId, userName, creationDate) VALUES (?, ?, ?, ?, ?, ?)'
    );
    insertStmt.run(
      postData.id,
      postData.title,
      postData.description,
      postData.userId,
      postData.userName,
      postData.creationDate
    );
    // The input postData should already have `replies: []` if it's a new post.
    return { success: true, post: postData };
  } catch (error: any) {
    console.error('Error adding forum post:', error);
    return { success: false, error: error.message || 'Failed to add forum post.' };
  }
}

// For addForumReply, the client will construct the Omit<...> part, and server action will complete it.
export async function addForumReply(
    postId: string, 
    replyInput: Omit<ForumReply, 'id' | 'postId' | 'creationDate'>
): Promise<{ success: boolean; reply?: ForumReply; error?: string }> {
  const db = getDb();
  try {
    const replyId = `reply-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const creationDate = new Date().toISOString();
    
    const newReply: ForumReply = {
      ...replyInput,
      id: replyId,
      postId: postId,
      creationDate: creationDate,
    };

    const insertStmt = db.prepare(
      'INSERT INTO forum_replies (id, postId, userId, userName, content, creationDate) VALUES (?, ?, ?, ?, ?, ?)'
    );
    insertStmt.run(
      newReply.id,
      newReply.postId,
      newReply.userId,
      newReply.userName,
      newReply.content,
      newReply.creationDate
    );
    return { success: true, reply: newReply };
  } catch (error: any) {
    console.error('Error adding forum reply:', error);
    return { success: false, error: error.message || 'Failed to add forum reply.' };
  }
}
