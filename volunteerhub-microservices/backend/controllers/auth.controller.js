
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
exports.setUserActive = async (req, res, next) => {
  try {
    const out = await authService.setUserActive(req.params.id, Boolean(req.body?.isActive));
    res.json(out);
  } catch (error) {
    next(error);
  }
};
exports.createOrganization = async (req, res, next) => {
  try {
    const out = await authService.createOrganization(req.user.id, req.body || {});
    res.status(201).json(out);
  } catch (error) {
    next(error);
  }
};
exports.reviewOrganization = async (req, res, next) => {
  try {
    const out = await authService.reviewOrganization(req.params.id, req.body?.status);
    res.json(out);
  } catch (error) {
    next(error);
  }
};

exports.updateOrganization = async (req, res, next) => {
  try {
    const out = await authService.updateOrganization(req.params.id, req.user.id, req.body || {});
    res.json(out);
  } catch (error) {
    next(error);
  }
};

exports.getOrganizations = async (_req, res, next) => {
  try {
    const out = await authService.getOrganizations();
    res.json(out);
  } catch (error) {
    next(error);
  }
};

exports.getMyOrganization = async (req, res, next) => {
  try {
    const out = await authService.getMyOrganization(req.user);
    res.json(out);
  } catch (error) {
    next(error);
  }
};
