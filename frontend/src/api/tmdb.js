const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const requests = {
  trending: `/trending/all/week?api_key=${API_KEY}`,
  netflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
  topRated: `/movie/top_rated?api_key=${API_KEY}`,
  action: `/discover/movie?api_key=${API_KEY}&with_genres=28`
};

export const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_URL = "https://image.tmdb.org/t/p/original";
export const YOUTUBE_URL = "https://www.youtube.com/watch?v=";