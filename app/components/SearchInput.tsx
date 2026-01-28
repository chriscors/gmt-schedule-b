'use client'

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface SearchInputProps {
  onSearch: (description: string) => void;
  disabled?: boolean;
}

export function SearchInput({ onSearch, disabled = false }: SearchInputProps) {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSearch(description.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your product (e.g., 'coffee beans', 'laptop computer')"
            disabled={disabled}
            className={cn(
              "w-full pl-12 pr-4 py-3.5",
              "bg-background border border-input rounded-lg",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200",
              "text-base"
            )}
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !description.trim()}
          className={cn(
            "px-8 py-3.5",
            "bg-primary text-primary-foreground font-semibold rounded-lg",
            "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed",
            "transition-all duration-200",
            "shadow-sm hover:shadow-md",
            "min-w-[120px]"
          )}
        >
          Search
        </button>
      </div>
    </form>
  );
}
