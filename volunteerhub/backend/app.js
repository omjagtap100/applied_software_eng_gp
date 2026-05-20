const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "volunteerhub-backend-monolith" });
  });

  app.use("/", apiRouter);

  app.use((err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message || "Server error" });
  });

  return app;
}

module.exports = createApp;
