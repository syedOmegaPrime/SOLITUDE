src/types/index.ts
export interface User {
  id: string;
  email: string;
  name?: string;
  // Add other user-specific fields if necessary
}

export interface Asset {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  imageUrl: string;
  uploaderId: string;
  uploaderName?: string; // Optional: denormalized for display
  uploadDate: string; // ISO date string
  category?: string; // Optional: for filtering
  fileType?: string; // Optional: to store the MIME type of the uploaded asset
  fileName?: string; // Optional: to store the original name of the uploaded file
}

export interface ForumPost {
  id: string;
  title: string;
  description: string;
  userId: string;
  userName?: string; // Optional: denormalized for display
  creationDate: string; // ISO date string
  replies?: ForumReply[];
}

export interface ForumReply {
  id: string;
  postId: string;
  userId: string;
  userName?: string;
  content: string;
  creationDate: string; // ISO date string
}


export interface CartItem {
  asset: Asset;
  quantity: number;
}
