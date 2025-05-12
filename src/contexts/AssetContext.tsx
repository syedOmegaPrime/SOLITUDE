"use client";
import type { Asset } from '@/types';
import React, { createContext, useState, ReactNode, useContext, useEffect, useCallback } from 'react';
import { getAssets as fetchAssetsFromServer, addAsset as addAssetToServer } from '@/actions/assetActions';

interface AssetContextType {
  assets: Asset[];
  addAsset: (newAssetData: Omit<Asset, 'id' | 'uploadDate'>) => Promise<{success: boolean; asset?: Asset; error?: string}>;
  isLoading: boolean;
  refreshAssets: () => Promise<void>;
}

export const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider = ({ children }: { children: ReactNode }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAssets = useCallback(async () => {
    setIsLoading(true);
    try {
      const serverAssets = await fetchAssetsFromServer();
      setAssets(serverAssets);
    } catch (error) {
      console.error("Failed to load assets:", error);
      setAssets([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const addAsset = async (newAssetData: Omit<Asset, 'id' | 'uploadDate'>) => {
    setIsLoading(true);
    const completeAssetData: Asset = {
        ...newAssetData,
        id: `asset-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        uploadDate: new Date().toISOString(),
    };
    const result = await addAssetToServer(completeAssetData);
    if (result.success && result.asset) {
      // Re-fetch all assets to ensure consistency after adding
      await loadAssets();
    } else {
      // If adding failed but we were loading, ensure loading is set to false
      setIsLoading(false);
    }
    return result;
  };

  const refreshAssets = async () => {
    await loadAssets();
  }

  return (
    <AssetContext.Provider value={{ assets, addAsset, isLoading, refreshAssets }}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAssets = () => {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
};
