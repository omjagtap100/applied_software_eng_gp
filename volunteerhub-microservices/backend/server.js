
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("node:dns");
require("dotenv").config();
const apiRouter = require("./routes");

const app = express();
const port = process.env.PORT || 5000;
const mongoUri =
  process.env.MONGO_URI ||
  "mongodb+srv://omjagtap3304_db_user:bu24sMMXlXo5jO8G@cluster0.zyrfzy8.mongodb.net/volunteerhubdb";

if (process.env.DNS_SERVERS) {
  const servers = process.env.DNS_SERVERS.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (servers.length > 0) dns.setServers(servers);
} else {
  const current = dns.getServers();
  if (current.length === 1 && current[0] === "127.0.0.1") {
    // Work around local DNS resolvers that refuse SRV lookups (breaks mongodb+srv)
    dns.setServers(["1.1.1.1", "1.0.0.1"]);
  }
}

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

async function run() {
  await mongoose.connect(mongoUri);
  app.listen(port, () => {
    console.log(`Backend monolith listening on http://localhost:${port}`);
  });
}

run().catch((error) => {
  console.error("MongoDB connection failed:", error);
  process.exit(1);
});











