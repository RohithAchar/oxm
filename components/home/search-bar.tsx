"use client";
import { useState, useRef } from "react";
import { Search, Clock, X, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [recentSearches, setRecentSearches] = useState([
    "watch for women",
    "leather handbag",
    "running shoes nike",
    "wireless earbuds",
  ]);

  const suggestions = [
    "summer dresses",
    "bluetooth headphones",
    "laptop bags",
    "smart watches",
    "running shoes",
  ];

  const handleSearch = () => {
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches((prev) => [query.trim(), ...prev.slice(0, 4)]);
    }
    setOpen(false);
    console.log("Searching:", query);
  };

  const handleItemClick = (term: string) => {
    setQuery(term);
    setOpen(false);
    console.log("Searching:", term);
  };

  const removeRecent = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((item) => item !== term));
  };

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(query.toLowerCase()) && query.length > 0
  );

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="bg-search rounded-2xl border border-border shadow-[var(--search-shadow)] p-3 flex items-center gap-3 cursor-text">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search for products..."
              className="flex-1 bg-transparent px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
            />

            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 py-2 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Button>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover border border-border rounded-xl shadow-lg"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="p-3 space-y-4">
            {/* Filtered Suggestions when typing */}
            {filteredSuggestions.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 px-1">
                  Suggestions
                </p>
                <div className="space-y-1">
                  {filteredSuggestions.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleItemClick(term)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors text-left"
                    >
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 px-1">
                  Recent searches
                </p>
                <div className="space-y-1">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleItemClick(term)}
                      className="w-full group flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors text-left"
                    >
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="flex-1">{term}</span>
                      <span
                        onClick={(e) => removeRecent(e, term)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Suggestions */}
            {query.length === 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 px-1">
                  Trending
                </p>
                <div className="space-y-1">
                  {suggestions.slice(0, 3).map((term) => (
                    <button
                      key={term}
                      onClick={() => handleItemClick(term)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors text-left"
                    >
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchBar;
