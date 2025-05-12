"use client"; 

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AssetCard from '@/components/marketplace/AssetCard';
import { useAssets } from '@/contexts/AssetContext';
import { ShoppingBag, MessageSquare, UploadCloud, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Asset } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { assets, isLoading: assetsLoading } = useAssets(); // Use isLoading from context
  const [featuredAssets, setFeaturedAssets] = useState<Asset[]>([]);
  // Removed local loading state, will rely on assetsLoading

  useEffect(() => {
    if (!assetsLoading && assets) { // Check if assets is not undefined
      setFeaturedAssets(assets.slice(0, 3));
    }
  }, [assets, assetsLoading]);

  if (assetsLoading) { // Use context's loading state for the whole section
    return (
      <div className="space-y-16">
        {/* Hero Section (can remain static or also have placeholders) */}
        <section className="relative text-center py-16 md:py-24 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 shadow-lg">
           <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "url('https://www.transparenttextures.com/patterns/batthern.png')",
              }}
              aria-hidden="true"
            />
          <div className="relative z-10 container mx-auto px-4">
            <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </section>

        {/* Featured Assets Section - Skeleton */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Featured Assets</h2>
            <Link href="/marketplace" passHref>
              <Button variant="link" className="text-primary hover:text-primary/80">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
                <Skeleton className="aspect-[3/2] w-full" />
                <div className="p-4 flex-grow space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <div className="p-4 pt-0 flex justify-between items-center">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Section (can remain static) */}
        <section className="py-12 bg-secondary/50 rounded-lg shadow-md">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">Contribute to SOLITUDE</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Are you a talented 2D or 3D artist? Share your creations with the community and earn. Upload your assets today!
              </p>
              <Link href="/upload" passHref>
                <Button size="lg" className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-0.5">
                  <UploadCloud className="mr-2 h-5 w-5" /> Upload Your Assets
                </Button>
              </Link>
            </div>
            <div className="hidden md:block">
              <Image 
                src="https://picsum.photos/seed/artist-community/500/300" 
                alt="Artist community illustration" 
                width={500} 
                height={300}
                className="rounded-lg shadow-xl object-cover"
                data-ai-hint="artist digital art"
              />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative text-center py-16 md:py-24 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 shadow-lg">
         <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "url('https://www.transparenttextures.com/patterns/batthern.png')",
            }}
            aria-hidden="true"
          />
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Discover Unique 2D & 3D Assets on SOLITUDE
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your central hub for high-quality 2D and 3D graphics, illustrations, and game assets, designed for and by the creative community.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/marketplace" passHref>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-0.5">
                <ShoppingBag className="mr-2 h-5 w-5" /> Explore Marketplace
              </Button>
            </Link>
            <Link href="/forum" passHref>
              <Button size="lg" variant="outline" className="shadow-md transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-0.5">
                <MessageSquare className="mr-2 h-5 w-5" /> Visit Forum
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Assets Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Featured Assets</h2>
          <Link href="/marketplace" passHref>
            <Button variant="link" className="text-primary hover:text-primary/80">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        {featuredAssets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAssets.map(asset => (
                <AssetCard key={asset.id} asset={asset} />
            ))}
            </div>
        ) : (
            <p className="text-muted-foreground text-center py-4">No featured assets available at the moment. Explore the marketplace to find or upload assets!</p>
        )}
      </section>

      {/* Call to Action Section */}
      <section className="py-12 bg-secondary/50 rounded-lg shadow-md">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Contribute to SOLITUDE</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Are you a talented 2D or 3D artist? Share your creations with the community and earn. Upload your assets today!
            </p>
            <Link href="/upload" passHref>
              <Button size="lg" className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-0.5">
                <UploadCloud className="mr-2 h-5 w-5" /> Upload Your Assets
              </Button>
            </Link>
          </div>
          <div className="hidden md:block">
            <Image 
              src="https://picsum.photos/seed/artist-community/500/300" 
              alt="Artist community illustration" 
              width={500} 
              height={300}
              className="rounded-lg shadow-xl object-cover"
              data-ai-hint="artist digital art"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
