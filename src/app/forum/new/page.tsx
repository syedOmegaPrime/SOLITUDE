"use client";

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import NewPostForm from '@/components/forum/NewPostForm';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewPostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/forum/new');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto py-12">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
        <Alert variant="destructive" className="max-w-md text-center">
          <Info className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You must be logged in to create a new forum post.
          </AlertDescription>
          <Button asChild className="mt-4">
            <Link href="/login?redirect=/forum/new">Login</Link>
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Create New Forum Post</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Need a specific 2D or 3D asset? Let the community know by creating a request.
        </p>
      </header>
      <div className="p-8 bg-card shadow-xl rounded-lg border">
        <NewPostForm />
      </div>
    </div>
  );
}
