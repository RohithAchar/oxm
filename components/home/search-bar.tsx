"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, X, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const STORAGE_KEY = "oxm_recent_searches";
const MAX_RECENT_SEARCHES = 10;
const DEBOUNCE_DELAY = 300;

interface AutocompleteSuggestion {
  id: string;
  text: string;
  type: string;
  category: string;
  brand: string;
}

const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load recent searches:", error);
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearches = useCallback((searches: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error("Failed to save recent searches:", error);
    }
  }, []);

  // Fetch autocomplete suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 1) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?type=autocomplete&q=${encodeURIComponent(
          searchQuery
        )}&limit=8`
      );
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      const data = await response.json();
      setSuggestions(data.data || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length > 0) {
      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(query);
      }, DEBOUNCE_DELAY);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, fetchSuggestions]);

  const handleSearch = useCallback(
    (searchQuery?: string) => {
      const searchTerm = (searchQuery || query).trim();
      if (!searchTerm) return;

      // Add to recent searches
      setRecentSearches((prev) => {
        const updated = [
          searchTerm,
          ...prev.filter(
            (item) => item.toLowerCase() !== searchTerm.toLowerCase()
          ),
        ].slice(0, MAX_RECENT_SEARCHES);
        saveRecentSearches(updated);
        return updated;
      });

      setOpen(false);
      setQuery("");
      router.push(`/products?q=${encodeURIComponent(searchTerm)}`);
    },
    [query, router, saveRecentSearches]
  );

  const handleItemClick = useCallback(
    (term: string) => {
      handleSearch(term);
    },
    [handleSearch]
  );

  const removeRecent = useCallback(
    (e: React.MouseEvent, term: string) => {
      e.stopPropagation();
      setRecentSearches((prev) => {
        const updated = prev.filter((item) => item !== term);
        saveRecentSearches(updated);
        return updated;
      });
    },
    [saveRecentSearches]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const allSuggestions = [
        ...suggestions.map((s) => s.text),
        ...(query.length === 0 ? [] : []),
      ];
      const allItems = [...allSuggestions, ...recentSearches];

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < allItems.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < allItems.length) {
          handleItemClick(allItems[selectedIndex]);
        } else {
          handleSearch();
        }
      } else if (e.key === "Escape") {
        setOpen(false);
        setSelectedIndex(-1);
      }
    },
    [
      suggestions,
      recentSearches,
      selectedIndex,
      query,
      handleItemClick,
      handleSearch,
    ]
  );

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions, query]);

  const highlightMatch = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(
      `(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const allItems = [
    ...suggestions.map((s) => ({ type: "suggestion", text: s.text, data: s })),
    ...recentSearches.map((s) => ({ type: "recent", text: s, data: s })),
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="bg-search rounded-2xl border border-border shadow-[var(--search-shadow)] p-3 flex items-center gap-3 cursor-text">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(-1);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search for products..."
              className="flex-1 bg-transparent px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
            />

            <Button
              onClick={() => handleSearch()}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 py-2 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Search</span>
            </Button>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover border border-border rounded-xl shadow-lg max-h-[400px] overflow-y-auto"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="p-3 space-y-4">
            {/* Loading state */}
            {loading && query.length > 0 && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Searching...
                </span>
              </div>
            )}

            {/* API Suggestions when typing */}
            {!loading && suggestions.length > 0 && query.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 px-1">
                  Suggestions
                </p>
                <div className="space-y-1">
                  {suggestions.map((suggestion, idx) => {
                    const itemIndex = idx;
                    const isSelected = selectedIndex === itemIndex;
                    return (
                      <button
                        key={suggestion.id}
                        onClick={() => handleItemClick(suggestion.text)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors text-left ${
                          isSelected ? "bg-muted" : ""
                        }`}
                      >
                        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate">
                            {highlightMatch(suggestion.text, query)}
                          </div>
                          {(suggestion.brand || suggestion.category) && (
                            <div className="text-xs text-muted-foreground truncate">
                              {suggestion.brand && (
                                <span>{suggestion.brand}</span>
                              )}
                              {suggestion.brand && suggestion.category && (
                                <span> • </span>
                              )}
                              {suggestion.category && (
                                <span>{suggestion.category}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {!loading && recentSearches.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 px-1">
                  Recent searches
                </p>
                <div className="space-y-1">
                  {recentSearches.map((term, idx) => {
                    const itemIndex = suggestions.length + idx;
                    const isSelected = selectedIndex === itemIndex;
                    return (
                      <button
                        key={term}
                        onClick={() => handleItemClick(term)}
                        className={`w-full group flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors text-left ${
                          isSelected ? "bg-muted" : ""
                        }`}
                      >
                        <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="flex-1">{term}</span>
                        <span
                          onClick={(e) => removeRecent(e, term)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading &&
              query.length === 0 &&
              suggestions.length === 0 &&
              recentSearches.length === 0 && (
                <div className="py-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Start typing to search for products
                  </p>
                </div>
              )}

            {/* No results */}
            {!loading &&
              query.length > 0 &&
              suggestions.length === 0 &&
              recentSearches.length === 0 && (
                <div className="py-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    No suggestions found
                  </p>
                </div>
              )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchBar;
