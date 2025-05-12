import type { Asset, ForumPost, User } from '@/types';

export const mockUsers: User[] = []; // Should remain empty, users are stored in SQLite

export const mockAssets: Asset[] = []; // Initialize as empty, assets will come from SQLite

export const mockForumPosts: ForumPost[] = []; // Initialize as empty, posts will come from SQLite

export const mockAssetCategories: string[] = [
  "All",
  "2D Characters",
  "3D Models",
  "Environments",
  "UI Kits",
  "Icons",
  "Textures & Materials",
  "Sprite Sheets",
  "Cultural Art",
  "Folk Illustrations",
  "Nature & Wildlife",
  "Event Graphics",
  "Abstract",
  "Other",
];
