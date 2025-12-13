import axios from "axios";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import { BASE_URL, IMAGE_URL } from "../api/TMDB";
import "./Row.css";

export default function Row({ title, fetchUrl }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`${BASE_URL}${fetchUrl}`);
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

  const handleClick = movie => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || movie?.title || movie?.original_name || "")
        .then(url => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch(error => console.log(error));
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
                className={`row_poster ${title === "NETFLIX ORIGINALS" && "row_posterLarge"}`}
                src={`${IMAGE_URL}${title === "NETFLIX ORIGINALS" ? movie.poster_path : movie.backdrop_path
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
