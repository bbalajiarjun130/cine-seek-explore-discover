
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { GenreCheckboxes } from "@/components/movies/GenreCheckboxes";
import { mockMovies } from "@/data/mockMovies";
import { Movie } from "@/types/movie";
import MovieCard from "@/components/movies/MovieCard";

const AdvancedSearch = () => {
  const currentYear = new Date().getFullYear();
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [yearRange, setYearRange] = useState([1900, currentYear]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleGenreChange = (genre: string, checked: boolean) => {
    if (checked) {
      setSelectedGenres([...selectedGenres, genre]);
    } else {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    }
  };

  const handleSearch = () => {
    const results = mockMovies.filter(movie => {
      const matchesTitle = title ? movie.title.toLowerCase().includes(title.toLowerCase()) : true;
      const matchesDirector = director ? movie.director.toLowerCase().includes(director.toLowerCase()) : true;
      const matchesYear = movie.year >= yearRange[0] && movie.year <= yearRange[1];
      const matchesGenre = selectedGenres.length === 0 || 
        selectedGenres.some(genre => movie.genre.includes(genre));
      
      return matchesTitle && matchesDirector && matchesYear && matchesGenre;
    });
    
    setSearchResults(results);
    setSearchPerformed(true);
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Advanced Search</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Movie Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter movie title..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="director">Director</Label>
                <Input 
                  id="director" 
                  placeholder="Enter director name..." 
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Release Year: {yearRange[0]} - {yearRange[1]}</Label>
              <Slider 
                defaultValue={yearRange} 
                min={1900} 
                max={currentYear} 
                step={1}
                onValueChange={setYearRange}
              />
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <Label>Genres</Label>
              <GenreCheckboxes 
                selectedGenres={selectedGenres}
                onGenreChange={handleGenreChange}
              />
            </div>
            
            <div className="pt-4">
              <Button onClick={handleSearch} className="w-full md:w-auto">
                Search Movies
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {searchPerformed && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Search Results: {searchResults.length} {searchResults.length === 1 ? 'movie' : 'movies'} found
            </h2>
            
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-lg text-muted-foreground">No movies found matching your criteria.</p>
                <p className="mt-2">Try adjusting your search filters.</p>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default AdvancedSearch;
