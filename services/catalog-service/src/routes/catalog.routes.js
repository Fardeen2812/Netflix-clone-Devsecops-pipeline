import express from "express";
import axios from "axios";
import https from "https";

const router = express.Router();

/**
 * -----------------------------
 * Hardened HTTPS Agent
 * -----------------------------
 * - keepAlive: reuse TCP connections
 * - maxSockets: avoid socket exhaustion
 * - timeout: prevent hanging TLS handshakes
 */
const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 10,
  timeout: 10000
});

/**
 * -----------------------------
 * TMDB Axios Client
 * -----------------------------
 */
const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 10000,
  httpsAgent,
  headers: {
    Accept: "application/json",
    "User-Agent": "catalog-service"
  }
});

/**
 * -----------------------------
 * Helper: Retry Wrapper
 * -----------------------------
 */
async function fetchWithRetry(requestFn, retries = 3, delayMs = 500) {
  let attempt = 0;

  while (attempt < retries) {
    try {
      return await requestFn();
    } catch (err) {
      attempt++;
      if (attempt >= retries) throw err;
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
}

/**
 * -----------------------------
 * /catalog/trending
 * -----------------------------
 */
router.get("/trending", async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "TMDB_API_KEY not configured" });
    }

    const response = await fetchWithRetry(() =>
      tmdbClient.get("/trending/all/week", {
        params: { api_key: apiKey }
      })
    );

    res.json(response.data);
  } catch (err) {
    console.error("Catalog trending error:", err.message);
    res.status(502).json({ error: "Failed to fetch trending content" });
  }
});

/**
 * -----------------------------
 * /catalog/netflix-originals
 * -----------------------------
 */
router.get("/netflix-originals", async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "TMDB_API_KEY not configured" });
    }

    const response = await fetchWithRetry(() =>
      tmdbClient.get("/discover/tv", {
        params: {
          api_key: apiKey,
          with_networks: 213
        }
      })
    );

    res.json(response.data);
  } catch (err) {
    console.error("Catalog originals error:", err.message);
    res.status(502).json({ error: "Failed to fetch Netflix originals" });
  }
});

/**
 * -----------------------------
 * /catalog/top-rated
 * -----------------------------
 */
router.get("/top-rated", async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "TMDB_API_KEY not configured" });
    }

    const response = await fetchWithRetry(() =>
      tmdbClient.get("/movie/top_rated", {
        params: { api_key: apiKey }
      })
    );

    res.json(response.data);
  } catch (err) {
    console.error("Catalog top-rated error:", err.message);
    res.status(502).json({ error: "Failed to fetch top rated movies" });
  }
});

/**
 * -----------------------------
 * /catalog/action
 * -----------------------------
 */
router.get("/action", async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "TMDB_API_KEY not configured" });
    }

    const response = await fetchWithRetry(() =>
      tmdbClient.get("/discover/movie", {
        params: {
          api_key: apiKey,
          with_genres: 28
        }
      })
    );

    res.json(response.data);
  } catch (err) {
    console.error("Catalog action error:", err.message);
    res.status(502).json({ error: "Failed to fetch action movies" });
  }
});

/**
 * -----------------------------
 * /catalog/video
 * Fetch trailer/video for a movie
 * -----------------------------
 */
router.get("/video", async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const { id, type } = req.query; // type = 'movie' or 'tv'

    if (!apiKey) {
      return res.status(500).json({ error: "TMDB_API_KEY not configured" });
    }
    if (!id) {
      return res.status(400).json({ error: "Missing movie/tv ID" });
    }

    const endpoint = type === "tv" ? `/tv/${id}/videos` : `/movie/${id}/videos`;

    const response = await fetchWithRetry(() =>
      tmdbClient.get(endpoint, {
        params: { api_key: apiKey }
      })
    );

    // Return the list of videos
    // Frontend expects { results: [...] } or just the array? 
    // Usually TMDB returns { id, results: [] }
    res.json(response.data);
  } catch (err) {
    console.error("Catalog video error:", err.message);
    res.status(502).json({ error: "Failed to fetch video" });
  }
});

export default router;
