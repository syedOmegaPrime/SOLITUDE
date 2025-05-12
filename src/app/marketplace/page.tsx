import MarketplaceClient from '@/components/marketplace/MarketplaceClient';

export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      <header className="text-center py-8 bg-gradient-to-r from-primary/5 via-background to-accent/5 rounded-lg shadow">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Asset Marketplace</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse, search, and discover a wide variety of 2D and 3D assets.
        </p>
      </header>
      <MarketplaceClient />
    </div>
  );
}
