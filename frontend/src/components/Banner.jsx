import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, requests, IMAGE_URL } from "../api/TMDB";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import "./Banner.css";

export default function Banner() {
  const [movie, setMovie] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`${BASE_URL}${requests.netflixOriginals}`);
      setMovie(
        res.data.results[
        Math.floor(Math.random() * res.data.results.length)
        ]
      );
    }
    fetchData();
  }, []);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handlePlay = () => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || movie?.title || movie?.original_name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <header
      className="banner"
      style={{
        backgroundImage: `url(${IMAGE_URL}${movie?.backdrop_path})`,
      }}
    >
      <div className="banner_contents">
        <h1>{movie?.name || movie?.title}</h1>
        <div className="banner_buttons">
          <button className="banner_button" onClick={handlePlay}>▶ Play</button>
          <button className="banner_button">➕ My List</button>
        </div>
        <p className="banner_description">{movie?.overview}</p>
      </div>
      <div className="banner_fadeBottom" />
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </header>
  );
}
