import { useEffect, useState } from "react";
import axios from "axios";
import { requests, IMAGE_URL } from "../api/tmdb";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import "./Banner.css";

export default function Banner() {
  const [movie, setMovie] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(requests.netflixOriginals);
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

  const handlePlay = async () => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      try {
        const type = movie?.media_type === 'tv' || movie?.name ? 'tv' : 'movie'; // Fallback logic

        const response = await axios.get("/api/video", {
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
