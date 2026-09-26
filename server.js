import express from "express";
import cors from "cors";
import { ANIME } from "dksanime-api";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Initialize the HiAnime provider (most reliable in the current list)
const provider = new ANIME.Hianime();

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "anime-api", provider: "hianime" });
});

// Search anime by title
app.get("/search/:query", async (req, res) => {
  try {
    const results = await provider.search(req.params.query);
    res.json(results);
  } catch (e) {
    console.error("search error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// Get anime info (episode list, description, etc.)
app.get("/anime/:id", async (req, res) => {
  try {
    const info = await provider.fetchAnimeInfo(req.params.id);
    res.json(info);
  } catch (e) {
    console.error("info error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// Get streaming sources for an episode
app.get("/watch/:episodeId", async (req, res) => {
  try {
    const sources = await provider.fetchEpisodeSources(req.params.episodeId);
    res.json(sources);
  } catch (e) {
    console.error("watch error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// Provider status check — useful to see which providers are alive
app.get("/providers", async (req, res) => {
  const list = ["Hianime", "AnimePahe", "KickAssAnime", "Gogoanime"];
  const status = {};
  for (const name of list) {
    try {
      const p = new ANIME[name]();
      status[name] = "loaded";
    } catch (e) {
      status[name] = "failed: " + e.message;
    }
  }
  res.json(status);
});

app.listen(PORT, () => {
  console.log(`anime-api running on port ${PORT}`);
});
