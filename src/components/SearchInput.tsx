import React, { useState } from 'react';

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
        <div className="flex-1">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your product (e.g., 'coffee beans', 'laptop computer')"
            disabled={disabled}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !description.trim()}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
