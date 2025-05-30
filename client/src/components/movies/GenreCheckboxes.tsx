
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface GenreCheckboxesProps {
  selectedGenres: string[];
  onGenreChange: (genre: string, checked: boolean) => void;
}

const genres = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", 
  "Documentary", "Drama", "Fantasy", "Horror", "Mystery",
  "Romance", "Sci-Fi", "Thriller"
];

export const GenreCheckboxes = ({ 
  selectedGenres, 
  onGenreChange 
}: GenreCheckboxesProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {genres.map((genre) => (
        <div key={genre} className="flex items-center space-x-2">
          <Checkbox 
            id={`genre-${genre}`}
            checked={selectedGenres.includes(genre)}
            onCheckedChange={(checked) => onGenreChange(genre, checked === true)}
          />
          <Label 
            htmlFor={`genre-${genre}`}
            className="text-sm cursor-pointer"
          >
            {genre}
          </Label>
        </div>
      ))}
    </div>
  );
};
