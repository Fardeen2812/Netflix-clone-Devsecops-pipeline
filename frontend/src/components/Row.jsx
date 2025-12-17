import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Row.css";

const Row = ({ title, fetchUrl, isLargeRow = false }) => {
  const [movies, setMovies] = useState([]);

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

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row__posters">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <img
              key={movie.id}
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
    </div>
  );
};

export default Row;
