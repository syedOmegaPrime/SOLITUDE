"use client";

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import UploadForm from '@/components/upload/UploadForm';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/upload');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto py-12">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!user) {
     // This state should ideally not be reached due to useEffect redirect,
     // but as a fallback or if redirect is slow.
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
        <Alert variant="destructive" className="max-w-md text-center">
          <Info className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You must be logged in to upload assets.
          </AlertDescription>
          <Button asChild className="mt-4">
            <Link href="/login?redirect=/upload">Login</Link>
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Upload Your Asset</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Share your 2D or 3D creative work with the SOLITUDE community.
        </p>
      </header>
      <div className="p-8 bg-card shadow-xl rounded-lg border">
        <UploadForm />
      </div>
    </div>
  );
}
