import React, { useEffect, useState } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import "./Row.css";

const Row = ({ title, fetchUrl, isLargeRow = false }) => {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const request = await axios.get(fetchUrl);

        if (isMounted && request?.data?.results) {
          setMovies(request.data.results);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error("API fetch failed:", error.message);
        setMovies([]);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = async (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      try {
        // Infer type: 'tv' usually has 'name', 'movie' has 'title'
        // Netflix Originals are mostly TV shows
        const type = movie.media_type === 'movie' ? 'movie' : (movie.name ? 'tv' : 'movie');

        const response = await axios.get("/api/video", {
          params: { id: movie.id, type }
        });

        const videos = response.data.results;
        // Find official trailer or teaser
        const trailer = videos?.find(vid => vid.site === "YouTube" && (vid.type === "Trailer" || vid.type === "Teaser")) || videos?.[0];

        if (trailer) {
          setTrailerUrl(trailer.key);
        } else {
          console.log("No trailer found");
          // Optional: Display a user-friendly toast/alert here?
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row__posters">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <img
              key={movie.id}
              onClick={() => handleClick(movie)}
              className={`row__poster ${isLargeRow && "row__posterLarge"
                }`}
              src={`https://image.tmdb.org/t/p/w500${isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
              alt={movie.name || movie.title}
            />
          ))
        ) : (
          <p style={{ color: "#999", fontSize: "14px" }}>
            Content unavailable
          </p>
        )}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
};

export default Row;
