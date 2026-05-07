
const jwt = require("jsonwebtoken");
 
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }
  const token = authHeader.slice(7);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "volunteerhub-secret");
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
 
module.exports = { requireAuth}