/**
 * KOROX Backend Server
 * Intent-based routing layer for Polkadot
 */
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { logger } from "./config/logger.js";
import { chainIntelligence } from "./services/polkadot/chainService.js";
const app = express();
const PORT = process.env.PORT || 4000;
// Middleware
app.use(cors());
app.use(express.json());
// API Routes
app.use("/api", routes);
// Root endpoint
app.get("/", (req, res) => {
    res.json({
        message: "KOROX - Cutting Complex Paths in Polkadot",
        version: "1.0.0",
        status: "running",
    });
});
// Start server
app.listen(PORT, async () => {
    logger.success(`🚀 KOROX Server running on http://localhost:${PORT}`);
    logger.info("Starting chain monitoring...");
    // Start background monitoring of chains
    chainIntelligence.startMonitoring(30); // Update every 30 seconds
    logger.success("✅ KOROX is ready to route!");
});
// Graceful shutdown
process.on("SIGINT", async () => {
    logger.info("Shutting down KOROX...");
    chainIntelligence.stopMonitoring();
    process.exit(0);
});
