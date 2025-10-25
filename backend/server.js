import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import { loginRoute, callbackRoute } from "./github.js";
import { analyzeRepo } from "./analyzer.js";

dotenv.config();
const app = express();

// Validate environment variables
if (!process.env.SESSION_SECRET) {
  console.error("ERROR: SESSION_SECRET is not set in .env file");
  process.exit(1);
}

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  console.error("ERROR: GitHub OAuth credentials are not set in .env file");
  process.exit(1);
}

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    github_client_id: process.env.GITHUB_CLIENT_ID ? "SET" : "MISSING",
    github_client_secret: process.env.GITHUB_CLIENT_SECRET ? "SET" : "MISSING"
  });
});

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
