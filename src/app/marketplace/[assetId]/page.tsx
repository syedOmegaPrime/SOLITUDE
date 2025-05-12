import type { Asset } from '@/types';
import AssetDetailsClient from '@/components/marketplace/AssetDetailsClient';
import AssetCard from '@/components/marketplace/AssetCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockAssets } from '@/data/mockData'; // This will be empty initially

interface AssetPageParams {
  params: {
    assetId: string;
  };
}

// This function is still needed for generateStaticParams if using SSG for assets,
// but with dynamic localStorage data, it might make more sense to fetch on demand.
// For now, if mockAssets is empty, this will generate no static pages, which is fine.
export async function generateStaticParams() {
  // In a real app with a DB, you'd fetch IDs here.
  // With localStorage, static generation of these dynamic detail pages is tricky.
  // We'll keep it for now, but it will only work if mockAssets has initial data.
  // If assets are purely dynamic from localStorage, this won't pre-render them.
  return mockAssets.map(asset => ({ // mockAssets will be empty
    assetId: asset.id,
  }));
}


// Simulate fetching an asset by ID - this is mainly for metadata.
// A client component will handle fetching from context.
async function getAssetStaticInfo(id: string): Promise<Partial<Asset> | undefined> {
  // This function is mainly for metadata. It can attempt to find from mock (empty)
  // or have a fallback. A better approach for fully dynamic content would be
  // to not use generateMetadata if the source is purely client-side context.
  // However, Next.js expects it for dynamic segments if not using client-side fetching for metadata.
  const asset = mockAssets.find(a => a.id === id); // Will likely be undefined
  if (asset) {
    return { name: asset.name, description: asset.description };
  }
  return undefined; // Fallback for dynamic assets
}

async function getRelatedAssetsStatic(currentAssetId: string, currentCategory?: string): Promise<Asset[]> {
  // This also won't find much if mockAssets is empty.
  // Related assets will be handled client-side.
  if (!currentCategory) return [];
  return mockAssets.filter(asset => asset.category === currentCategory && asset.id !== currentAssetId).slice(0,3);
}


export async function generateMetadata({ params }: AssetPageParams) {
  const assetInfo = await getAssetStaticInfo(params.assetId);
  if (!assetInfo || !assetInfo.name) {
    return { 
        title: 'Asset Details - SOLITUDE',
        description: 'View details for this 2D or 3D asset.' 
    };
  }
  return {
    title: `${assetInfo.name} - SOLITUDE`,
    description: (assetInfo.description || '').substring(0, 150) + "...",
  };
}

export default async function AssetPage({ params }: AssetPageParams) {
  // The actual fetching and display logic will be in AssetDetailsClient
  // which can access the AssetContext.
  // We pass assetId to it.
  // For related assets, AssetDetailsClient can fetch them from context as well.

  // The initial asset for related assets logic here will be undefined if not in mock.
  // This section for relatedAssets will effectively be empty if using client-side data primarily.
  const assetForRelated = await getAssetStaticInfo(params.assetId);
  const relatedAssets = assetForRelated ? await getRelatedAssetsStatic(params.assetId, assetForRelated.category) : [];


  return (
    <div className="space-y-12">
      <Link href="/marketplace" className="inline-flex items-center text-sm text-primary hover:underline mb-6 group">
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Marketplace
      </Link>
      
      <AssetDetailsClient assetId={params.assetId} />

      {/* Related Assets section might be better handled within AssetDetailsClient if data is dynamic */}
      {relatedAssets.length > 0 && (
        <section className="pt-12 border-t">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6">Related Assets (Static Fallback)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedAssets.map(relatedAsset => (
              <AssetCard key={relatedAsset.id} asset={relatedAsset} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
