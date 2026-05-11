import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to database");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();
