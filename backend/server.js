import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import { loginRoute, callbackRoute } from "./github.js";
import { analyzeRepo } from "./analyzer.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(express.json());

app.get("/auth/login", loginRoute);
app.get("/auth/callback", callbackRoute);

app.post("/analyze", async (req, res) => {
  try {
    const { url, token } = req.body;
    
    if (!url || !token) {
      return res.status(400).json({ error: "Repository URL and token are required" });
    }
    
    const result = await analyzeRepo(url, token);
    res.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ 
      error: error.message || "Failed to analyze repository" 
    });
  }
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
