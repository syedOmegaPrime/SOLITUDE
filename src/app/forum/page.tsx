import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ForumClient from '@/components/forum/ForumClient';
import { PlusCircle } from 'lucide-react';

export default function ForumPage() {
  return (
    <div className="space-y-8">
      <header className="py-8 bg-gradient-to-r from-primary/5 via-background to-accent/5 rounded-lg shadow">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
            <div>
                <h1 className="text-4xl font-bold tracking-tight text-primary text-center sm:text-left">Asset Request Forum</h1>
                <p className="mt-3 text-lg text-muted-foreground max-w-2xl text-center sm:text-left">
                Request specific 2D or 3D assets or discuss ideas with the community.
                </p>
            </div>
            <Link href="/forum/new" passHref>
                <Button className="mt-4 sm:mt-0 bg-accent hover:bg-accent/90 text-accent-foreground shadow-md">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Post
                </Button>
            </Link>
        </div>
      </header>
      
      <ForumClient />
    </div>
  );
}
