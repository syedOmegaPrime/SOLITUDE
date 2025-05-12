"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, X } from 'lucide-react';
import { mockAssetCategories } from '@/data/mockData';

interface FilterControlsProps {
  onFilterChange: (filters: any) => void; // Replace 'any' with a proper filter type
  initialFilters: any;
}

const FilterControls = ({ onFilterChange, initialFilters }: FilterControlsProps) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [category, setCategory] = useState(initialFilters.category || 'All');
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange || [0, 500]); // Max price example
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'relevance');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleApplyFilters = () => {
    onFilterChange({ searchTerm, category, priceRange, sortBy });
  };
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setPriceRange([0, 500]);
    setSortBy('relevance');
    onFilterChange({ searchTerm: '', category: 'All', priceRange: [0, 500], sortBy: 'relevance' });
  };


  return (
    <div className="p-6 bg-card rounded-lg shadow-lg border space-y-6">
      <h3 className="text-xl font-semibold text-foreground">Filters</h3>

      {/* Search Input */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>
      
      <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full">
        {/* Category Filter */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-base font-medium">Category</AccordionTrigger>
          <AccordionContent>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {mockAssetCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range Filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-medium">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>৳{priceRange[0]}</span>
                <span>৳{priceRange[1]}{priceRange[1] === 500 ? '+' : ''}</span>
              </div>
              <Slider
                defaultValue={[0, 500]}
                min={0}
                max={500}
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sort By Filter */}
        <AccordionItem value="sort">
          <AccordionTrigger className="text-base font-medium">Sort By</AccordionTrigger>
          <AccordionContent>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex space-x-3 pt-4 border-t">
        <Button onClick={handleApplyFilters} className="flex-1 bg-primary hover:bg-primary/90">Apply Filters</Button>
        <Button onClick={handleResetFilters} variant="outline" className="flex-1">
          <X className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>
    </div>
  );
};

export default FilterControls;
