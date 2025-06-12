
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

interface SearchInputProps {
  searchType: 'sitter' | 'product' | 'parent';
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
}

export const SearchInput = ({ 
  searchType, 
  onSearch, 
  initialValue = '', 
  placeholder = 'Search...' 
}: SearchInputProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
  };

  return (
    <div className="relative mb-4">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <Input 
        className="pl-10 py-3 bg-white rounded-lg border-gray-200" 
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};
