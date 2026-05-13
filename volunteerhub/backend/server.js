
const mongoose = require("mongoose");
const dns = require("node:dns");
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const createApp = require("./app");

const app = createApp();
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

async function run() {
  await mongoose.connect(mongoUri);
  app.listen(port, () => {
    console.log(`Backend  listening on http://localhost:${port}`);
  });
}

run().catch((error) => {
  console.error("MongoDB connection failed:", error);
  process.exit(1);
});











