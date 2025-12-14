import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import catalogRoutes from "./src/routes/catalog.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ service: "catalog-service", status: "healthy" });
});

app.use("/catalog", catalogRoutes);

app.listen(PORT, () => {
  console.log(`✅ catalog-service running on port ${PORT}`);
});
