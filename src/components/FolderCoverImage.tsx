import React, { useEffect, useRef, useState } from "react";
import { VITE_UNSPLASH_ACCESS_KEY } from "../environment";
import Tooltip from "./Tooltip";

interface FolderCoverImageProps {
  coverImage?: string;
  onChangeCoverImage: (coverImage?: string) => void;
}

const UNSPLASH_ACCESS_KEY = VITE_UNSPLASH_ACCESS_KEY;

interface UnsplashPhoto {
  urls: { regular: string };
}

const FolderCoverImage: React.FC<FolderCoverImageProps> = ({
  coverImage,
  onChangeCoverImage,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
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
        setSuggestions(data.map((img) => img.urls.regular));
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

  // Fetch a random Unsplash image
  const fetchRandomUnsplash = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.unsplash.com/photos/random?orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data: UnsplashPhoto = await res.json();
      if (data && data.urls && data.urls.regular) {
        onChangeCoverImage(data.urls.regular);
      } else {
        setError("Could not fetch image");
      }
    } catch {
      setError("Could not fetch image");
    }
    setLoading(false);
  };

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
        setResults(data.results.map((img) => img.urls.regular));
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

  // UI when no cover image
  if (!coverImage) {
    return (
      <div className="relative opacity-0 hover:opacity-100 w-full">
        <div className="w-fit h-12 bg-[#2a2a2a] dark:bg-[#1a1a1a] rounded-xl flex items-center justify-center text-[#666666] dark:text-[#999999]">
          <Tooltip
            id="add-cover-tooltip"
            content="Add a cover image to this folder"
          >
            <button
              className="px-4 py-2 bg-[#333333] dark:bg-[#222222] rounded-lg shadow text-sm font-medium hover:bg-[#404040] dark:hover:bg-[#2a2a2a] transition-colors text-white"
              onClick={fetchRandomUnsplash}
              disabled={loading}
            >
              {loading ? "Loading..." : "Add cover image"}
            </button>
          </Tooltip>
        </div>
      </div>
    );
  }

  // UI when cover image is present
  return (
    <div className="relative px-6 w-full group" style={{ minHeight: 120 }}>
      <img
        src={coverImage}
        alt="Folder cover"
        className="w-full h-32 lg:h-60 object-cover shadow-sm rounded-xl"
      />
      {/* Overlay button - only visible on hover */}
      <Tooltip id="change-cover-tooltip" content="Change cover image">
        <button
          className="absolute top-2 right-2 bg-[#333333]/90 dark:bg-[#222222]/90 rounded px-3 py-1 text-xs font-medium shadow hover:bg-[#404040] dark:hover:bg-[#2a2a2a] transition-colors text-white opacity-0 group-hover:opacity-100 focus:opacity-100"
          onClick={() => setShowMenu((v) => !v)}
          tabIndex={0}
          aria-label="Change cover"
          style={{ transition: "opacity 0.2s" }}
        >
          Change cover
        </button>
      </Tooltip>
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
              className="flex-1 px-2 py-1 rounded border border-[#404040] dark:border-[#2a2a2a] text-xs bg-[#2a2a2a] dark:bg-[#1a1a1a] text-white placeholder-[#666666]"
            />
            <Tooltip id="search-images-tooltip" content="Search for images">
              <button
                type="submit"
                className="px-2 py-1 rounded bg-white text-[#222222] text-xs hover:bg-[#f0f0f0]"
                disabled={loading}
              >
                Search
              </button>
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
                {suggestions.map((img, i) => (
                  <Tooltip
                    key={img + i}
                    id={`select-image-${i}`}
                    content="Select this image"
                  >
                    <button
                      className="block w-full h-16 rounded overflow-hidden border border-[#404040] dark:border-[#2a2a2a] focus:ring-2 focus:ring-white"
                      style={{ padding: 0 }}
                      onClick={() => {
                        onChangeCoverImage(img);
                        setShowMenu(false);
                      }}
                    >
                      <img
                        src={img}
                        alt="Unsplash suggestion"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  </Tooltip>
                ))}
              </div>
            </>
          )}

          {/* Search results */}
          {search && (
            <div className="grid grid-cols-4 gap-2">
              {results.map((img, i) => (
                <Tooltip
                  key={img + i}
                  id={`select-image-${i}`}
                  content="Select this image"
                >
                  <button
                    className="block w-full h-16 rounded overflow-hidden border border-[#404040] dark:border-[#2a2a2a] focus:ring-2 focus:ring-white"
                    style={{ padding: 0 }}
                    onClick={() => {
                      onChangeCoverImage(img);
                      setShowMenu(false);
                    }}
                  >
                    <img
                      src={img}
                      alt="Unsplash result"
                      className="w-full h-full object-cover"
                    />
                  </button>
                </Tooltip>
              ))}
            </div>
          )}

          <button
            className="block w-full text-left px-2 py-1 rounded hover:bg-[#404040] dark:hover:bg-[#2a2a2a] text-xs text-red-500 mt-2"
            onClick={() => {
              onChangeCoverImage(undefined);
              setShowMenu(false);
            }}
          >
            Remove cover
          </button>
        </div>
      )}
    </div>
  );
};

export default FolderCoverImage;
