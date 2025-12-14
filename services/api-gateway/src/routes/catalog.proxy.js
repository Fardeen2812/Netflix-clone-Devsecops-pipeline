import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/trending", async (req, res) => {
  try {
    const baseUrl = process.env.CATALOG_SERVICE_URL?.trim();

    if (!baseUrl) {
      return res
        .status(500)
        .json({ error: "CATALOG_SERVICE_URL not configured" });
    }

    const response = await axios.get(
      `${baseUrl}/catalog/trending`
    );

    res.json(response.data);
  } catch (err) {
    console.error("Gateway → Catalog error:", err.message);
    res.status(502).json({ error: "Catalog service unavailable" });
  }
});

export default router;
