import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

/* 1️⃣ Create app FIRST */
const app = express();
const PORT = process.env.PORT || 8080;

/* 2️⃣ Middleware */
app.use(cors());
app.use(express.json());

/* 3️⃣ Root route (optional but nice) */
app.get("/", (req, res) => {
  res.send("Netflix Clone Backend is running 🚀");
});

/* 4️⃣ Health check */
app.get("/health", (req, res) => {
  res.json({ status: "Backend is alive 🚀" });
});

/* 5️⃣ TMDB Proxy Route */
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const fetchWithRetry = async (url, params, retries = 3, delay = 1000) => {
  try {
    return await axios.get(url, { params });
  } catch (error) {
    if (retries > 0 && (error.code === 'ECONNRESET' || error.response?.status >= 500)) {
      console.warn(`Retrying ${url}... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, params, retries - 1, delay * 2);
    }
    throw error;
  }
};

app.get("/api/trending", async (req, res) => {
  try {
    const response = await fetchWithRetry(
      `${TMDB_BASE_URL}/trending/all/week`,
      { api_key: TMDB_API_KEY }
    );
    res.json(response.data);
  } catch (error) {
    console.error("TMDB error:", error.message);
    res.status(500).json({ error: "Failed to fetch trending movies" });
  }
});

app.get("/api/netflix-originals", async (req, res) => {
  try {
    const response = await fetchWithRetry(
      `${TMDB_BASE_URL}/discover/tv?with_networks=213`,
      { api_key: TMDB_API_KEY }
    );
    res.json(response.data);
  } catch (error) {
    console.error("TMDB error:", error.message);
    res.status(500).json({ error: "Failed to fetch Netflix Originals" });
  }
});

app.get("/api/top-rated", async (req, res) => {
  try {
    const response = await fetchWithRetry(
      `${TMDB_BASE_URL}/movie/top_rated`,
      { api_key: TMDB_API_KEY }
    );
    res.json(response.data);
  } catch (error) {
    console.error("TMDB error:", error.message);
    res.status(500).json({ error: "Failed to fetch Top Rated movies" });
  }
});

app.get("/api/action", async (req, res) => {
  try {
    const response = await fetchWithRetry(
      `${TMDB_BASE_URL}/discover/movie?with_genres=28`,
      { api_key: TMDB_API_KEY }
    );
    res.json(response.data);
  } catch (error) {
    console.error("TMDB error:", error.message);
    res.status(500).json({ error: "Failed to fetch Action movies" });
  }
});

app.get("/api/video", async (req, res) => {
  const { id, type } = req.query;
  if (!id) return res.status(400).json({ error: "Movie/Show ID required" });

  const initialType = type === 'tv' ? 'tv' : 'movie';
  const fallbackType = initialType === 'tv' ? 'movie' : 'tv';

  try {
    const response = await fetchWithRetry(
      `${TMDB_BASE_URL}/${initialType}/${id}/videos`,
      { api_key: TMDB_API_KEY },
      3, // retries
      1000 // delay
    );
    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn(`Video not found for ${initialType}/${id}, trying ${fallbackType}...`);
      try {
        const fallbackResponse = await fetchWithRetry(
          `${TMDB_BASE_URL}/${fallbackType}/${id}/videos`,
          { api_key: TMDB_API_KEY },
          3,
          1000
        );
        res.json(fallbackResponse.data);
      } catch (fallbackError) {
        console.error(`TMDB video error (fallback failed):`, fallbackError.message);
        res.status(404).json({ error: "Video not found" });
      }
    } else {
      console.error("TMDB video error:", error.message);
      res.status(500).json({ error: "Failed to fetch video" });
    }
  }
});

/* 6️⃣ Start server LAST */
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
