const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const CREATE_KEYS = ["name", "email", "password", "role"];

function buildError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function assertOnlyKeys(payload, allowed) {
  if (!payload || typeof payload !== "object") return "Request body must be an object";
  for (const key of Object.keys(payload)) {
    if (!allowed.has(key)) return `Unknown field: ${key}`;
  }
  return null;
}

async function register(payload) {
  const unknown = assertOnlyKeys(payload, new Set(CREATE_KEYS));
  if (unknown) throw buildError(unknown, 400);

  const { name, email, password, role } = payload;
  if (!name || !email || !password || !role) {
    throw buildError("name, email, password, role are required", 400);
  }

  const existing = await User.findOne({ email: String(email).toLowerCase() }).lean();
  if (existing) throw buildError("Email already exists", 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: String(email).toLowerCase(),
    passwordHash,
    role
  });
  return { id: String(user._id), name: user.name, email: user.email, role: user.role };
}

async function login(payload, jwtSecret) {
  const { email, password } = payload;
  if (!email || !password) throw buildError("email and password are required", 400);

  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user) throw buildError("Invalid credentials", 401);
  if (!user.isActive) throw buildError("User account is deactivated", 403);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw buildError("Invalid credentials", 401);

  return jwt.sign(
    {
      id: String(user._id),
      email: user.email,
      role: user.role,
      name: user.name
    },
    jwtSecret,
    { expiresIn: "24h" }
  );
}

module.exports = {
  register,
  login
}
