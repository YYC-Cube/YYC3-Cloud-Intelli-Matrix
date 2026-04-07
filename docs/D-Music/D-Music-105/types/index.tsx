import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-8196f310/health", (c) => {
  return c.json({ status: "ok" });
});

// ─── Theme Config Sync Routes ────────────────────────

// Save theme config
app.post("/make-server-8196f310/theme/save", async (c) => {
  try {
    const body = await c.req.json();
    const { deviceId, config } = body;
    if (!deviceId || !config) {
      return c.json({ error: "Missing deviceId or config" }, 400);
    }
    await kv.set(`theme_config_${deviceId}`, {
      config,
      updatedAt: new Date().toISOString(),
    });
    return c.json({ status: "ok" });
  } catch (e: any) {
    console.log("Error saving theme config:", e.message);
    return c.json({ error: `Failed to save theme: ${e.message}` }, 500);
  }
});

// Load theme config
app.get("/make-server-8196f310/theme/load/:deviceId", async (c) => {
  try {
    const deviceId = c.req.param("deviceId");
    const data = await kv.get(`theme_config_${deviceId}`);
    if (!data) {
      return c.json({ config: null });
    }
    return c.json(data);
  } catch (e: any) {
    console.log("Error loading theme config:", e.message);
    return c.json({ error: `Failed to load theme: ${e.message}` }, 500);
  }
});

// Share theme - save a shared skin preset
app.post("/make-server-8196f310/theme/share", async (c) => {
  try {
    const body = await c.req.json();
    const { shareCode, skin } = body;
    if (!shareCode || !skin) {
      return c.json({ error: "Missing shareCode or skin" }, 400);
    }
    await kv.set(`shared_skin_${shareCode}`, {
      skin,
      createdAt: new Date().toISOString(),
    });
    return c.json({ status: "ok", shareCode });
  } catch (e: any) {
    console.log("Error sharing skin:", e.message);
    return c.json({ error: `Failed to share skin: ${e.message}` }, 500);
  }
});

// Import shared skin
app.get("/make-server-8196f310/theme/shared/:code", async (c) => {
  try {
    const code = c.req.param("code");
    const data = await kv.get(`shared_skin_${code}`);
    if (!data) {
      return c.json({ error: "Skin not found" }, 404);
    }
    return c.json(data);
  } catch (e: any) {
    console.log("Error loading shared skin:", e.message);
    return c.json({ error: `Failed to load shared skin: ${e.message}` }, 500);
  }
});

// ─── Music Library Sync Routes ───────────────────────

// Save music library (tracks metadata and albums)
app.post("/make-server-8196f310/library/save", async (c) => {
  try {
    const body = await c.req.json();
    const { deviceId, tracks, albums } = body;
    if (!deviceId || !tracks || !albums) {
      return c.json({ error: "Missing deviceId, tracks, or albums" }, 400);
    }
    // We only save metadata, not the actual File objects
    await kv.set(`music_library_${deviceId}`, {
      tracks: tracks.map((t: any) => ({
        id: t.id,
        title: t.title,
        albumId: t.albumId,
        isVideo: t.isVideo,
        // We don't save the local blob URL as it won't be valid on next load
      })),
      albums,
      updatedAt: new Date().toISOString(),
    });
    return c.json({ status: "ok" });
  } catch (e: any) {
    console.log("Error saving library:", e.message);
    return c.json({ error: `Failed to save library: ${e.message}` }, 500);
  }
});

// Load music library
app.get("/make-server-8196f310/library/load/:deviceId", async (c) => {
  try {
    const deviceId = c.req.param("deviceId");
    const data = await kv.get(`music_library_${deviceId}`);
    if (!data) {
      return c.json({ library: null });
    }
    return c.json(data);
  } catch (e: any) {
    console.log("Error loading library:", e.message);
    return c.json({ error: `Failed to load library: ${e.message}` }, 500);
  }
});

// AI Lyrics Generation Proxy (Optional, for bypassing CORS if calling from server)
// However, Ollama is usually local, so the frontend should call it directly.
// We'll provide a route that can call an external LLM if needed.
app.post("/make-server-8196f310/ai/generate-lyrics", async (c) => {
  try {
    const { theme, style, mood, language } = await c.req.json();
    // This could call OpenAI/Ollama if configured. 
    // For now, it's a placeholder for the "docking" logic.
    return c.json({ 
      message: "AI generation endpoint ready",
      suggestion: "Please use local Ollama at http://localhost:11434 if available"
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

Deno.serve(app.fetch);