"use client";

import type { Asset } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useAssets } from '@/contexts/AssetContext'; // Import useAssets
import { ShoppingCart, Tag, UserCircle, CalendarDays, Layers, FileArchive, Download, Eye } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import AssetCard from './AssetCard'; // For related assets
import Link from 'next/link'; // For "Asset not found" link


interface AssetDetailsClientProps {
  assetId: string;
}

export default function AssetDetailsClient({ assetId }: AssetDetailsClientProps) {
  const { assets: allAssets } = useAssets();
  const { addToCart } = useCart();
  
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const foundAsset = allAssets.find(a => a.id === assetId);
    if (foundAsset) {
      setAsset(foundAsset);
    }
    setIsLoading(false);
  }, [allAssets, assetId]);

  const relatedAssets = useMemo(() => {
    if (!asset) return [];
    return allAssets
      .filter(a => a.category === asset.category && a.id !== asset.id)
      .slice(0, 3);
  }, [asset, allAssets]);

  const isZipFile = asset?.fileType === 'application/zip';

  const handleAddToCart = () => {
    if (asset) {
      addToCart(asset, quantity);
    }
  };

  const handleDownload = () => {
    if (!asset) return;
    // In a real app, this would trigger a download from a secure URL.
    // For Data URIs (for images) or mock ZIPs, this is a simplified example.
    if (isZipFile) {
      alert(`Simulating download of ${asset.fileName || asset.name}. In a real app, this would download the actual file.`);
    } else if (asset.imageUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = asset.imageUrl;
      link.download = asset.fileName || `${asset.name.replace(/\s+/g, '_')}.${asset.imageUrl.split('/')[1].split(';')[0]}`; // Guess extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
        window.open(asset.imageUrl, '_blank');
    }
  };
  
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div>
          <Skeleton className="aspect-video w-full rounded-md" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-destructive">Asset Not Found</h1>
        <p className="mt-4 text-muted-foreground">The asset you are looking for does not exist or may have been removed.</p>
         <Link href="/marketplace" className="mt-8 inline-block">
            <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" /> Back to Marketplace
            </Button>
        </Link>
      </div>
    );
  }


  return (
    <>
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
      {/* Asset Image/Preview */}
      <div className="bg-card p-4 rounded-lg shadow-lg border">
        <div className="aspect-video relative w-full rounded-md overflow-hidden bg-secondary/30 flex items-center justify-center">
          {isZipFile ? (
            <div className="text-center">
              <FileArchive className="h-32 w-32 text-muted-foreground mx-auto" />
              <p className="mt-2 text-sm text-muted-foreground">{asset.fileName || "ZIP Archive"}</p>
            </div>
          ) : (
            <Image
              src={asset.imageUrl}
              alt={asset.name}
              layout="fill"
              objectFit="contain" 
              className="transform hover:scale-105 transition-transform duration-300"
              data-ai-hint={asset.imageUrl.startsWith('data:') ? `${asset.tags.slice(0,2).join(" ")} asset` : `${asset.tags.slice(0,2).join(" ")} design`}
            />
          )}
        </div>
      </div>

      {/* Asset Info */}
      <div className="space-y-6">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">{asset.name}</h1>
        
        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <div className="flex items-center">
                <UserCircle className="h-4 w-4 mr-1.5 text-primary" />
                <span>By {asset.uploaderName || 'Unknown Artist'}</span>
            </div>
            <span className="text-muted-foreground/50">|</span>
            <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1.5 text-primary" />
                <span>Uploaded: {new Date(asset.uploadDate).toLocaleDateString()}</span>
            </div>
        </div>

        <div className="flex items-center space-x-2">
            {asset.category && (
                <div className="flex items-center text-sm text-muted-foreground">
                    <Layers className="h-4 w-4 mr-1.5 text-primary" />
                    <span>Category: {asset.category}</span>
                </div>
            )}
            {asset.fileType && (
                 <Badge variant={isZipFile ? "default" : "secondary"} className="text-xs">
                    {isZipFile ? "ZIP Archive" : asset.fileType.split('/')[1].toUpperCase()}
                </Badge>
            )}
        </div>
        
        <p className="text-2xl font-semibold text-primary">৳{asset.price.toFixed(2)}</p>

        <p className="text-foreground/80 leading-relaxed">{asset.description}</p>

        <div className="space-y-3">
          <h3 className="text-md font-medium text-foreground flex items-center">
            <Tag className="h-4 w-4 mr-2 text-primary" />
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {asset.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">{tag}</Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-3 pt-4 border-t">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</Button>
              <span className="w-10 text-center text-lg font-medium">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(q => q + 1)}>+</Button>
            </div>
            <Button size="lg" onClick={handleAddToCart} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
          {(asset.price === 0 || asset.imageUrl.startsWith('data:') || isZipFile) && (
            <Button size="lg" variant="outline" onClick={handleDownload} className="w-full">
                <Download className="mr-2 h-5 w-5" />
                {isZipFile ? `Download ${asset.fileName || 'Archive'}` : `Download Image`}
            </Button>
          )}
        </div>
      </div>
    </div>
    {relatedAssets.length > 0 && (
        <section className="pt-12 border-t mt-12">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6">Related Assets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedAssets.map(relatedAsset => (
              <AssetCard key={relatedAsset.id} asset={relatedAsset} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
