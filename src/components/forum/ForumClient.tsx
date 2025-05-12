"use client";

import { useState, useMemo, useEffect } from 'react';
import type { ForumPost } from '@/types';
import ForumPostCard from './ForumPostCard';
import { useForum } from '@/contexts/ForumContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MessageCircleOff } from 'lucide-react'; 
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Skeleton } from '@/components/ui/skeleton';

const POSTS_PER_PAGE = 8;

export default function ForumClient() {
  const { posts: allPosts, isLoading: forumLoading } = useForum(); 
  // Removed local isLoading, will use forumLoading from context.

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // No longer need useEffect for local loading state based on allPosts.

  const filteredAndSortedPosts = useMemo(() => {
    if (forumLoading) return []; // If forum data is loading, return empty
    
    let posts = [...allPosts];

    if (searchTerm) {
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'oldest':
        posts.sort((a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime());
        break;
      case 'most_replies':
        posts.sort((a, b) => (b.replies?.length || 0) - (a.replies?.length || 0));
        break;
      case 'newest':
      default:
        posts.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
        break;
    }
    return posts;
  }, [allPosts, searchTerm, sortBy, forumLoading]);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = forumLoading ? [] : filteredAndSortedPosts.slice( // Avoid slicing if loading
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5; 
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages, currentPage + halfMaxPages);

    if (currentPage <= halfMaxPages) {
        endPage = Math.min(totalPages, maxPagesToShow);
    }
    if (currentPage + halfMaxPages >= totalPages) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    if (startPage > 1) {
        items.push(
            <PaginationItem key="start-ellipsis">
                <PaginationEllipsis />
            </PaginationItem>
        );
    }

    for (let i = startPage; i <= endPage; i++) {
        items.push(
            <PaginationItem key={i}>
                <PaginationLink href="#" isActive={i === currentPage} onClick={(e) => { e.preventDefault(); handlePageChange(i);}}>
                    {i}
                </PaginationLink>
            </PaginationItem>
        );
    }

    if (endPage < totalPages) {
        items.push(
            <PaginationItem key="end-ellipsis">
                <PaginationEllipsis />
            </PaginationItem>
        );
    }
    return items;
  };

  if (forumLoading) { // Use context's loading state
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card rounded-lg shadow border">
          <Skeleton className="h-10 w-full sm:max-w-xs" />
          <Skeleton className="h-10 w-full sm:w-[180px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(POSTS_PER_PAGE)].map((_, i) => (
             <CardSkeleton key={i}/>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card rounded-lg shadow border">
        <div className="relative w-full sm:max-w-xs">
          <Input
            type="text"
            placeholder="Search forum posts..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <Select value={sortBy} onValueChange={(value) => { setSortBy(value); setCurrentPage(1); }}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="most_replies">Most Replies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {paginatedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedPosts.map(post => (
            <ForumPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageCircleOff className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h3 className="text-2xl font-semibold text-muted-foreground">No Posts Found</h3>
          <p className="mt-2 text-foreground">
            {searchTerm ? "Try a different search term or " : ""}Be the first to create a post!
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if(currentPage > 1) handlePageChange(currentPage - 1);}} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}/>
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if(currentPage < totalPages) handlePageChange(currentPage + 1);}} className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}/>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

const CardSkeleton = () => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col h-full">
    <div className="p-4 space-y-2">
        <Skeleton className="h-6 w-3/4" /> 
    </div>
    <div className="p-4 flex-grow space-y-1">
        <Skeleton className="h-4 w-full" /> 
        <Skeleton className="h-4 w-5/6" /> 
    </div>
    <div className="p-4 pt-0 flex justify-between items-center border-t mt-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-6 w-6 rounded-full" /> 
        <Skeleton className="h-4 w-20" /> 
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-10" /> 
      </div>
    </div>
  </div>
);
