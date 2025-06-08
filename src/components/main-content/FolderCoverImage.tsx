import React, { useEffect, useRef, useState } from "react";
import { VITE_UNSPLASH_ACCESS_KEY } from "../../environment";
import { Button } from "../Button";
import Tooltip from "../Tooltip";

interface FolderCoverImageProps {
  coverImage?: string;
  onChangeCoverImage: (coverImage?: string) => void;
}

const UNSPLASH_ACCESS_KEY = VITE_UNSPLASH_ACCESS_KEY;

interface UnsplashPhoto {
  urls: {
    thumb: string;
    regular: string;
    full: string;
  };
  id: string;
}

interface ImageData {
  thumb: string;
  regular: string;
  full: string;
  id: string;
}

const FolderCoverImage: React.FC<FolderCoverImageProps> = ({
  coverImage,
  onChangeCoverImage,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<ImageData[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  // Fetch random Unsplash images for suggestions
  const fetchRandomSuggestions = async () => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/photos/random?count=8&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data: UnsplashPhoto[] = await res.json();
      if (data) {
        setSuggestions(
          data.map((img) => ({
            thumb: img.urls.thumb,
            regular: img.urls.regular,
            full: img.urls.full,
            id: img.id,
          }))
        );
      }
    } catch {
      // Silently fail for suggestions
    }
  };

  // Load suggestions when menu opens
  useEffect(() => {
    if (showMenu) {
      fetchRandomSuggestions();
    }
  }, [showMenu]);

  // Search Unsplash
  const searchUnsplash = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&orientation=landscape&per_page=8&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data: { results: UnsplashPhoto[] } = await res.json();
      if (data && data.results) {
        setResults(
          data.results.map((img) => ({
            thumb: img.urls.thumb,
            regular: img.urls.regular,
            full: img.urls.full,
            id: img.id,
          }))
        );
      } else {
        setResults([]);
        setError("No results");
      }
    } catch {
      setError("Could not fetch images");
      setResults([]);
    }
    setLoading(false);
  };

  // If no cover image, don't render anything
  if (!coverImage) {
    return null;
  }

  // UI when cover image is present
  return (
    <div className="relative w-full group" style={{ minHeight: 120 }}>
      <img
        src={coverImage}
        alt="Folder cover"
        className="w-full h-32 lg:h-60 xl:h-[16rem] object-cover shadow-sm"
      />
      {/* Overlay button - only visible on hover */}
      <Button
        variant="secondary"
        size="sm"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100"
        onClick={() => setShowMenu((v) => !v)}
        aria-label="Change cover"
      >
        Change cover
      </Button>

      {/* Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute pt-5 top-10 right-2 bg-[#333333] dark:bg-[#222222] border border-[#404040] dark:border-[#2a2a2a] rounded-lg shadow-lg p-3 z-20 w-80"
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (search.trim()) searchUnsplash(search.trim());
            }}
            className="flex gap-1 mb-2"
          >
            <input
              type="text"
              placeholder="Search images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none px-2 py-1 rounded border border-[#404040] dark:border-[#2a2a2a] text-xs bg-[#2a2a2a] dark:bg-[#1a1a1a] text-white placeholder-[#666666]"
            />
            <Tooltip id="search-images-tooltip" content="Search for images">
              <Button
                type="submit"
                variant="default"
                size="sm"
                disabled={loading}
              >
                Search
              </Button>
            </Tooltip>
          </form>
          {loading && <div className="text-xs text-[#999999]">Loading...</div>}
          {error && <div className="text-xs text-red-500 mb-2">{error}</div>}

          {/* Random suggestions */}
          {!search && (
            <>
              <div className="text-xs text-[#999999] mb-2 mt-4">
                Suggestions
              </div>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {suggestions.map((img) => (
                  <Button
                    key={img.id}
                    variant="ghost"
                    className="block w-full h-16 hover:scale-105 active:scale-95 transition-transform rounded overflow-hidden border border-[#404040] dark:border-[#2a2a2a] p-0"
                    onClick={() => {
                      // First set the regular quality
                      onChangeCoverImage(img.regular);
                      // Then load the full quality
                      const fullImg = new Image();
                      fullImg.src = img.full;
                      fullImg.onload = () => {
                        onChangeCoverImage(img.full);
                      };
                      setShowMenu(false);
                    }}
                  >
                    <img
                      src={img.thumb}
                      alt="Unsplash suggestion"
                      className="w-full h-full object-cover"
                    />
                  </Button>
                ))}
              </div>
            </>
          )}

          {/* Search results */}
          {search && (
            <div className="grid grid-cols-4 gap-2">
              {results.map((img, i) => (
                <Tooltip
                  key={img.id}
                  id={`select-image-${i}`}
                  content="Select this image"
                >
                  <Button
                    variant="ghost"
                    className="block w-full hover:scale-105 active:scale-95 transition-transform h-16 rounded overflow-hidden border border-[#404040] dark:border-[#2a2a2a] p-0"
                    onClick={() => {
                      // First set the regular quality
                      onChangeCoverImage(img.regular);
                      // Then load the full quality
                      const fullImg = new Image();
                      fullImg.src = img.full;
                      fullImg.onload = () => {
                        onChangeCoverImage(img.full);
                      };
                      setShowMenu(false);
                    }}
                  >
                    <img
                      src={img.thumb}
                      alt="Unsplash result"
                      className="w-full h-full object-cover"
                    />
                  </Button>
                </Tooltip>
              ))}
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-left text-red-500 mt-2"
            onClick={() => {
              onChangeCoverImage("");
              setShowMenu(false);
            }}
          >
            Remove cover
          </Button>
        </div>
      )}
    </div>
  );
};

export default FolderCoverImage;
