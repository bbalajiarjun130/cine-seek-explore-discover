import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import SearchBar from "@/components/movies/SearchBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { mockMovies } from "@/data/mockMovies";
import { Movie } from "@/types/movie";
import MovieCard from "@/components/movies/MovieCard";
import { GenreCheckboxes } from "@/components/movies/GenreCheckboxes";
import { request } from "http";

const AdvancedSearch = () => {
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [actor, setActor] = useState("");
  const [yearRange, setYearRange] = useState<[number, number]>([1900, new Date().getFullYear()]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 10]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [results, setResults] = useState<Movie[]>([]);
  
  const handleGenreChange = (genre: string, checked: boolean) => {
    if (checked) {
      setSelectedGenres([...selectedGenres, genre]);
    } else {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    }
  };

  const handleSearch =  async () => {
    try {
      const res = await fetch("/api/movies/advanced-search", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        genre: selectedGenres.join(', '),  // backend expects a string
        actors: actor ? [actor.trim()] : [],          // array of actors
        year: yearRange,                   // array of [min, max] years
        director,
        rating: ratingRange                // array of [min, max] ratings
      })
    });
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const movies = await res.json();
    console.log('Search results:', movies);
    setResults(movies);

  } catch (error) {
    console.error('Search failed:', error);
  }
};

  const handleReset = () => {
    setTitle("");
    setDirector("");
    setActor("");
    setYearRange([1900, new Date().getFullYear()]);
    setRatingRange([0, 10]);
    setSelectedGenres([]);
    setResults([]);
  };

  return (
    <PageLayout>
      <div className="container py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8">Advanced Search</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
          <div className="space-y-6 border border-border/50 p-6 rounded-lg bg-card/50">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Movie Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="director">Director</Label>
                <Input
                  id="director"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="actor">Actor/Actress</Label>
                <Input
                  id="actor"
                  value={actor}
                  onChange={(e) => setActor(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Release Year: {yearRange[0]} - {yearRange[1]}</Label>
                <Slider
                  value={[yearRange[0], yearRange[1]]}
                  min={1900}
                  max={new Date().getFullYear()}
                  step={1}
                  onValueChange={(value) => setYearRange([value[0], value[1]])}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Rating: {ratingRange[0]} - {ratingRange[1]}</Label>
                <Slider
                  value={[ratingRange[0], ratingRange[1]]}
                  min={0}
                  max={10}
                  step={0.1}
                  onValueChange={(value) => setRatingRange([value[0], value[1]])}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="block mb-2">Genres</Label>
                <GenreCheckboxes 
                  selectedGenres={selectedGenres}
                  onGenreChange={handleGenreChange}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleSearch} className="flex-1">Search</Button>
              <Button variant="outline" onClick={handleReset} className="flex-1">Reset</Button>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Results ({results.length})</h2>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    year={movie.year}
                    genre={movie.genre}
                    poster={movie.poster}
                    rating={movie.rating}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No results found. Try adjusting your search criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdvancedSearch;
