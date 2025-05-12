'use server';
import { getDb } from '@/lib/db';
import type { Asset } from '@/types';

export async function getAssets(): Promise<Asset[]> {
  const db = getDb();
  try {
    const stmt = db.prepare('SELECT * FROM assets ORDER BY uploadDate DESC');
    const assetsFromDb = stmt.all() as Asset[]; // Assume Asset type matches DB columns for now
    
    // Transform tags from comma-separated string to array
    return assetsFromDb.map(asset => ({
        ...asset,
        // Ensure tags is treated as string before splitting, provide default if null/undefined
        tags: typeof asset.tags === 'string' ? asset.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [] 
    }));
  } catch (error: any) {
    console.error('Error fetching assets:', error);
    return [];
  }
}

// Input type for addAsset matches the client-side structure where tags is an array
export async function addAsset(newAssetData: Asset): Promise<{ success: boolean; asset?: Asset; error?: string }> {
  const db = getDb();
  try {
    // Convert tags array to comma-separated string for DB storage
    const tagsForDb = Array.isArray(newAssetData.tags) ? newAssetData.tags.join(',') : '';

    const insertStmt = db.prepare(
      'INSERT INTO assets (id, name, description, price, tags, imageUrl, uploaderId, uploaderName, uploadDate, category, fileType, fileName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    insertStmt.run(
      newAssetData.id,
      newAssetData.name,
      newAssetData.description,
      newAssetData.price,
      tagsForDb,
      newAssetData.imageUrl,
      newAssetData.uploaderId,
      newAssetData.uploaderName,
      newAssetData.uploadDate,
      newAssetData.category,
      newAssetData.fileType,
      newAssetData.fileName
    );
    // Return the asset with tags as an array for consistency
    return { success: true, asset: { ...newAssetData, tags: Array.isArray(newAssetData.tags) ? newAssetData.tags : [] } };
  } catch (error: any) {
    console.error('Error adding asset:', error);
    return { success: false, error: error.message || 'Failed to add asset.' };
  }
}
