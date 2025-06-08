import { ImageIcon } from "lucide-react";
import React, { useState } from "react";
import { VITE_UNSPLASH_ACCESS_KEY } from "../../environment";
import { Button } from "../Button";

interface AddCoverImageButtonProps {
  onCoverImageSelected: (coverImage: string) => void;
}

const AddCoverImageButton: React.FC<AddCoverImageButtonProps> = ({
  onCoverImageSelected,
}) => {
  const [loading, setLoading] = useState(false);

  const handleAddCoverImage = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.unsplash.com/photos/random?orientation=landscape&client_id=${VITE_UNSPLASH_ACCESS_KEY}`
      );
      const data = await res.json();
      if (data && data.urls) {
        // First set the regular quality
        onCoverImageSelected(data.urls.regular);
        // Then load the full quality
        const fullImg = new Image();
        fullImg.src = data.urls.full;
        fullImg.onload = () => {
          onCoverImageSelected(data.urls.full);
        };
      }
    } catch (error) {
      console.error("Failed to fetch cover image:", error);
    }
    setLoading(false);
  };

  return (
    <div className="relative w-fit opacity-0 h-10 hover:opacity-100 transition-opacity duration-200">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAddCoverImage}
        disabled={loading}
      >
        {loading ? (
          "Loading..."
        ) : (
          <p className="flex items-center gap-2">
            <ImageIcon size={14} /> Add cover image
          </p>
        )}
      </Button>
    </div>
  );
};

export default AddCoverImageButton;
