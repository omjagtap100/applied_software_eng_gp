const { requireAuth, requireRole } = require("../middleware/auth.middleware");



const express = require("express");
const Controllers = require("../controllers");
const authRouter = express.Router();
authRouter.post("/register", Controllers.authController.register);
authRouter.post("/login", Controllers.authController.login);
authRouter.post(
  "/organizations",
  requireAuth,
  requireRole(["OrganisationManager"]),
  Controllers.authController.createOrganization
);
authRouter.get("/organizations", requireAuth, Controllers.authController.getOrganizations);
authRouter.patch(
  "/organizations/:id/review",
  requireAuth,
  requireRole(["Admin"]),
  Controllers.authController.reviewOrganization
);
authRouter.put(
  "/organizations/:id",
  requireAuth,
  requireRole(["OrganisationManager"]),
  Controllers.authController.updateOrganization
);
const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
module.exports = apiRouter; 