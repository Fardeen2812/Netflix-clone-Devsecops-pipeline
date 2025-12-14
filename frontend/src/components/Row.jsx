import axios from "axios";
import { IMAGE_URL } from "../api/tmdb";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

import "./Row.css";

export default function Row({ title, fetchUrl }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(fetchUrl);
      setMovies(res.data.results);
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const handleClick = async (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      try {
        const isNetflixOriginal = title === "Netflix Originals";
        const type = isNetflixOriginal || movie.media_type === 'tv' ? 'tv' : 'movie';

        const response = await axios.get("http://localhost:8080/api/video", {
          params: { id: movie.id, type }
        });

        const videos = response.data.results;
        const trailer = videos?.find(vid => vid.site === "YouTube" && vid.type === "Trailer") || videos?.[0];

        if (trailer) {
          setTrailerUrl(trailer.key);
        } else {
          console.log("No trailer found");
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_posters">
        {movies.map(
          movie =>
            movie.poster_path && (
              <img
                key={movie.id}
                onClick={() => handleClick(movie)}
                className={`row_poster ${title === "Netflix Originals" && "row_posterLarge"}`}
                src={`${IMAGE_URL}${title === "Netflix Originals" ? movie.poster_path : movie.backdrop_path
                  }`}
                alt={movie.name}
              />
            )
        )}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}
