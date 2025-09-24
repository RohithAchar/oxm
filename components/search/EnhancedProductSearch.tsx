"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Clock, TrendingUp, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";

interface SearchSuggestion {
  id: string;
  text: string;
  type: "product" | "category" | "brand";
  category?: string;
  brand?: string;
}

interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

type EnhancedProductSearchProps = {
  placeholder?: string;
  size?: "xxs" | "xs" | "sm" | "md" | "lg";
  rounded?: "full" | "md";
  showCamera?: boolean;
  className?: string;
  buttonMode?: "label" | "icon";
  showSuggestions?: boolean;
  maxSuggestions?: number;
};

export default function EnhancedProductSearch({
  placeholder = "Search products",
  size = "md",
  rounded = "full",
  showCamera = false,
  className = "",
  buttonMode = "label",
  showSuggestions = true,
  maxSuggestions = 8,
}: EnhancedProductSearchProps) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      try {
        const history: SearchHistoryItem[] = JSON.parse(savedHistory);
        setSearchHistory(history);
        setRecentSearches(history.slice(0, 5).map((item) => item.query));
      } catch (error) {
        console.error("Error loading search history:", error);
      }
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query || query.length < 1) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/search?type=autocomplete&q=${encodeURIComponent(
            query
          )}&limit=${maxSuggestions}`,
          {
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Search request failed");
        }

        const data = await response.json();
        if (data.success) {
          setSuggestions(data.data || []);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Search error:", error);
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [maxSuggestions]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (newValue.trim()) {
      setIsOpen(true);
      debouncedSearch(newValue);
    } else {
      setIsOpen(false);
      setSuggestions([]);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsInputFocused(true);
    if (value.trim() || recentSearches.length > 0) {
      setIsOpen(true);
    }
  };

  // Handle input blur
  const handleInputBlur = (e: React.FocusEvent) => {
    // Check if the new focus target is within the popover
    const relatedTarget = e.relatedTarget as HTMLElement;
    const isWithinPopover =
      relatedTarget &&
      relatedTarget.closest("[data-radix-popper-content-wrapper]");

    if (!isWithinPopover) {
      setIsInputFocused(false);
      // Delay closing to allow for suggestion clicks
      setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };

  // Handle search submission
  const handleSearch = (query?: string) => {
    const searchQuery = query || value.trim();
    if (!searchQuery) return;

    // Add to search history
    const newHistoryItem: SearchHistoryItem = {
      query: searchQuery,
      timestamp: Date.now(),
    };

    const updatedHistory = [
      newHistoryItem,
      ...searchHistory.filter((item) => item.query !== searchQuery),
    ].slice(0, 10); // Keep only last 10 searches

    setSearchHistory(updatedHistory);
    setRecentSearches(updatedHistory.slice(0, 5).map((item) => item.query));

    // Save to localStorage
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

    // Navigate to search results
    router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
    setValue("");
    setIsOpen(false);
    setSuggestions([]);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    // Prevent focus loss by maintaining focus on input
    if (inputRef.current) {
      inputRef.current.focus();
    }
    handleSearch(suggestion.text);
  };

  // Handle recent search selection
  const handleRecentSearchSelect = (query: string) => {
    // Prevent focus loss by maintaining focus on input
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setValue(query);
    handleSearch(query);
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    setRecentSearches([]);
    localStorage.removeItem("searchHistory");
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Size classes
  const heightClass =
    size === "xxs"
      ? "h-6"
      : size === "xs"
      ? "h-7"
      : size === "sm"
      ? "h-8"
      : size === "lg"
      ? "h-12 md:h-14"
      : "h-10 md:h-12";

  const btnHeightClass =
    size === "xxs"
      ? "h-6 px-1.5"
      : size === "xs"
      ? "h-7 px-2"
      : size === "sm"
      ? "h-8 px-2.5"
      : size === "lg"
      ? "h-10 px-4"
      : "h-9 px-3.5";

  const radiusClass = rounded === "full" ? "rounded-full" : "rounded-md";

  const iconSize =
    size === "xxs"
      ? "h-2.5 w-2.5"
      : size === "xs"
      ? "h-3 w-3"
      : size === "sm"
      ? "h-3.5 w-3.5"
      : "h-4 w-4 md:h-5 md:w-5";

  const textSize =
    size === "xxs"
      ? "text-[10px]"
      : size === "xs"
      ? "text-[11px]"
      : size === "sm"
      ? "text-xs"
      : "text-sm md:text-base";

  return (
    <div className={`relative w-full ${className}`}>
      <Popover open={isOpen && showSuggestions} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search
              className={`pointer-events-none absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${iconSize}`}
            />
            <Input
              ref={inputRef}
              className={`w-full ${heightClass} ${radiusClass} bg-background border-input ${
                size === "xxs"
                  ? "pl-6 pr-7"
                  : size === "xs"
                  ? "pl-7 pr-8"
                  : "pl-8 sm:pl-9 pr-10"
              } outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 ${textSize} placeholder:text-muted-foreground`}
              placeholder={placeholder}
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              aria-label="Search"
            />
            {buttonMode === "icon" ? (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search"
                onClick={() => handleSearch()}
                className={`absolute right-0.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${
                  size === "xxs"
                    ? "h-6 w-6 p-0"
                    : size === "xs"
                    ? "h-7 w-7 p-0"
                    : ""
                }`}
              >
                <Search className={iconSize} />
              </Button>
            ) : (
              <Button
                onClick={() => handleSearch()}
                className={`bg-red-600 hover:bg-red-700 text-white absolute right-1.5 top-1/2 -translate-y-1/2 ${btnHeightClass} ${radiusClass}`}
              >
                Search
              </Button>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          side="bottom"
        >
          <Command>
            <CommandList className="max-h-[300px]">
              {isLoading && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    Searching...
                  </span>
                </div>
              )}

              {!isLoading && suggestions.length === 0 && value.trim() && (
                <CommandEmpty>No suggestions found for "{value}"</CommandEmpty>
              )}

              {!isLoading && suggestions.length > 0 && (
                <CommandGroup heading="Suggestions">
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={`${suggestion.type}-${suggestion.id}`}
                      onSelect={() => handleSuggestionSelect(suggestion)}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent input blur
                        handleSuggestionSelect(suggestion);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">{suggestion.text}</div>
                        {suggestion.brand && (
                          <div className="text-xs text-muted-foreground">
                            {suggestion.brand}
                            {suggestion.category && ` • ${suggestion.category}`}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {!isLoading && recentSearches.length > 0 && !value.trim() && (
                <CommandGroup heading="Recent Searches">
                  {recentSearches.map((query, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleRecentSearchSelect(query)}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent input blur
                        handleRecentSearchSelect(query);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">{query}</span>
                    </CommandItem>
                  ))}
                  <CommandItem
                    onSelect={clearSearchHistory}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input blur
                      clearSearchHistory();
                    }}
                    className="flex items-center gap-2 cursor-pointer text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear history</span>
                  </CommandItem>
                </CommandGroup>
              )}

              {!isLoading && !value.trim() && recentSearches.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Start typing to search products</p>
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
