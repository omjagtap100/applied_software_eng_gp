
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Organization = require("../models/organization.model");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://omjagtap3304_db_user:bu24sMMXlXo5jO8G@cluster0.zyrfzy8.mongodb.net/volunteerhubdb";

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected for seeding (Sprint 1)");

  await Organization.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("Pass@12345", 10);

  const users = await User.insertMany([
    {
      name: "Admin User",
      email: "admin@volunteerhub.local",
      passwordHash,
      role: "Admin"
    },
    {
      name: "Org Manager",
      email: "manager@volunteerhub.local",
      passwordHash,
      role: "OrganisationManager"
    },
    {
      name: "Demo Volunteer",
      email: "demo.volunteer@volunteerhub.local",
      passwordHash,
      role: "Volunteer"
    }
  ]);

  const manager = users.find((u) => u.role === "OrganisationManager");

  await Organization.create({
    name: "Community Helpers",
    description: "Local community volunteer organization",
    category: "Community",
    address: "Melbourne VIC",
    contactEmail: "contact@communityhelpers.local",
    managerUserId: String(manager._id),
    status: "Approved"
  });

  console.log("Seed completed.");
  console.log("Admin: admin@volunteerhub.local / Pass@12345");
  console.log("Manager: manager@volunteerhub.local / Pass@12345");
  console.log("Volunteer: demo.volunteer@volunteerhub.local / Pass@12345");

  await mongoose.disconnect();
}

run()
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error("Seed failed:", error.message);
    try {
      await mongoose.disconnect();
    } catch (_e) {
     
    }
    process.exit(1);
  });
