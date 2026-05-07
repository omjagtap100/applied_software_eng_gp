


const express = require("express");
const Controllers = require("../controllers");
const authRouter = express.Router();
authRouter.post("/register", Controllers.authController.register);
authRouter.post("/login", Controllers.authController.login);
const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
module.exports = apiRouter;