import express from "express";
import axios from "axios";

const router = express.Router();

// Generic proxy for all catalog routes
router.use("/", async (req, res) => {
  try {
    const baseUrl = process.env.CATALOG_SERVICE_URL?.trim();

    if (!baseUrl) {
      return res
        .status(500)
        .json({ error: "CATALOG_SERVICE_URL not configured" });
    }

    // req.path will be "/trending", "/netflix-originals", etc.
    // because this router is mounted at "/api" in server.js
    const targetUrl = `${baseUrl}/catalog${req.path}`;

    // Forward query parameters
    const response = await axios.get(targetUrl, {
      params: req.query
    });

    res.json(response.data);
  } catch (err) {
    console.error(`Gateway proxy error for ${req.path}:`, err.message);
    if (err.response) {
      res.status(err.response.status).json(err.response.data);
    } else {
      res.status(502).json({ error: "Catalog service unavailable" });
    }
  }
});

export default router;
