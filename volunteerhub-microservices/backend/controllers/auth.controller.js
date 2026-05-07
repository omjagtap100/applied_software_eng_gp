
const authService = require("../services/auth.service");

exports.register = async (req, res, next) => {
  try {
    const created = await authService.register(req.body || {});
    res.status(201).json({ data: created });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const token = await authService.login(req.body || {}, process.env.JWT_SECRET || "volunteerhub-secret");
    res.json({ token });
  } catch (error) {
    next(error);
  }
};