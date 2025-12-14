import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import catalogProxy from "./src/routes/catalog.proxy.js";

dotenv.config();
console.log("CATALOG_SERVICE_URL =", process.env.CATALOG_SERVICE_URL);


const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ service: "api-gateway", status: "healthy" });
});

/**
 * Frontend will call:
 *   /api/trending
 *   /api/top-rated
 */
app.use("/api", catalogProxy);

app.listen(PORT, () => {
  console.log(`✅ API Gateway running on port ${PORT}`);
});
