const { requireAuth, requireRole } = require("../middleware/auth.middleware");



const express = require("express");
const Controllers = require("../controllers");
const authRouter = express.Router();
authRouter.post("/register", Controllers.authController.register);
authRouter.post("/login", Controllers.authController.login);
authRouter.patch("/profile", requireAuth, Controllers.authController.updateProfile);
authRouter.get("/profile", requireAuth, Controllers.authController.getProfile);
 

 
authRouter.post(
  "/organizations",
  requireAuth,
  requireRole(["OrganisationManager"]),
  Controllers.authController.createOrganization
);
authRouter.get("/organizations", requireAuth, Controllers.authController.getOrganizations);
authRouter.get(
  "/organizations/me",
  requireAuth,
  requireRole(["OrganisationManager"]),
  Controllers.authController.getMyOrganization
);
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
authRouter.patch("/users/:id/active", requireAuth, requireRole(["Admin"]), Controllers.authController.setUserActive);

const eventsRouter = express.Router();
eventsRouter.get("/", requireAuth, Controllers.eventController.getAllEvents);
eventsRouter.get("/:id", requireAuth, Controllers.eventController.getEventById);
eventsRouter.post(
  "/",
  requireAuth,
  requireRole(["OrganisationManager", "Admin"]),
  Controllers.eventController.createEvent
);
eventsRouter.put(
  "/:id",
  requireAuth,
  requireRole(["OrganisationManager", "Admin"]),
  Controllers.eventController.updateEvent
);
eventsRouter.patch(
  "/:id/cancel",
  requireAuth,
  requireRole(["OrganisationManager", "Admin"]),
  Controllers.eventController.cancelEvent
);

const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/events", eventsRouter);
module.exports = apiRouter; 