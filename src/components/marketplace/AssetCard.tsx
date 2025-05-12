"use client";
import Image from 'next/image';
import Link from 'next/link';
import type { Asset } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShoppingCart, Eye, FileArchive } from 'lucide-react'; // Replaced FileZip with FileArchive
import { useCart } from '@/hooks/useCart';
import { Badge } from '@/components/ui/badge';

interface AssetCardProps {
  asset: Asset;
}

const AssetCard = ({ asset }: AssetCardProps) => {
  const { addToCart } = useCart();
  const isZipFile = asset.fileType === 'application/zip';

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/marketplace/${asset.id}`} passHref className="block group">
        <CardHeader className="p-0">
          <div className="aspect-[3/2] relative w-full bg-secondary/30 flex items-center justify-center">
            {isZipFile ? (
              <FileArchive className="h-24 w-24 text-muted-foreground" />
            ) : (
              <Image
                src={asset.imageUrl}
                alt={asset.name}
                layout="fill"
                objectFit="cover" // Use cover for better aesthetics if aspect ratio mismatches
                className="transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={asset.imageUrl.startsWith('data:') ? `${asset.tags.slice(0,2).join(" ")} visual` : `${asset.tags.slice(0,2).join(" ")}`} // More generic hint for Data URIs
              />
            )}
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4 flex-grow">
        <Link href={`/marketplace/${asset.id}`} passHref className="block">
          <CardTitle className="text-lg font-semibold hover:text-primary transition-colors">{asset.name}</CardTitle>
        </Link>
        <CardDescription className="text-sm mt-1 text-muted-foreground truncate">
          By {asset.uploaderName || 'Unknown Artist'}
        </CardDescription>
        <div className="mt-2 flex flex-wrap gap-1">
          {asset.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
          {isZipFile && <Badge variant="outline" className="text-xs">ZIP</Badge>}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-xl font-bold text-primary">৳{asset.price.toFixed(2)}</p>
        <div className="flex space-x-2">
          <Link href={`/marketplace/${asset.id}`} passHref>
            <Button variant="outline" size="icon" aria-label="View Asset">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button size="icon" onClick={() => addToCart(asset)} aria-label="Add to cart" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AssetCard;
