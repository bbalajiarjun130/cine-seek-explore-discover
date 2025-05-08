
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import SearchBar from "@/components/movies/SearchBar";
import MovieCard from "@/components/movies/MovieCard";
import { mockMovies } from "@/data/mockMovies";
import { Movie } from "@/types/movie";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const initialQuery = searchParams.get("q") || "";

  useEffect(() => {
    if (initialQuery) {
      searchMovies(initialQuery);
    } else {
      setMovies(mockMovies);
    }
  }, [initialQuery]);

  const searchMovies = (query: string) => {
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const filtered = mockMovies.filter(movie => {
        const searchTerm = query.toLowerCase();
        return (
          movie.title.toLowerCase().includes(searchTerm) ||
          movie.director.toLowerCase().includes(searchTerm) ||
          movie.genre.some(g => g.toLowerCase().includes(searchTerm)) ||
          movie.plot.toLowerCase().includes(searchTerm) ||
          movie.actors?.some(actor => actor.toLowerCase().includes(searchTerm))
        );
      });
      
      setMovies(filtered);
      setIsLoading(false);
      
      if (filtered.length === 0) {
        toast({
          title: "No results found",
          description: `No movies matching "${query}" were found`,
          variant: "destructive",
        });
      }
    }, 500);
  };

  const handleSearch = (query: string) => {
    setSearchParams({ q: query });
    searchMovies(query);
  };

  return (
    <PageLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Search Movies</h1>
        
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search by title, director, genre..."
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <>
            {initialQuery && (
              <p className="mb-4 text-muted-foreground">
                {movies.length} results {initialQuery ? `for "${initialQuery}"` : ''}
              </p>
            )}
            
            {movies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map((movie) => (
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
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">No movies found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms</p>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default Search;
