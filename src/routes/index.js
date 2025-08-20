const { Router } = require("express");
const authRoutes = require("./auth");
const usersRoutes = require("./users");
const logsRoutes = require("./logs");

const routes = Router();

routes.get("/", (req, res) => {
  res.json({ 
    message: "SPS Server API", 
    version: "1.0.0",
    endpoints: {
      auth: "/auth/login",
      users: "/users",
      logs: "/logs"
    }
  });
});

routes.use("/auth", authRoutes);
routes.use("/users", usersRoutes);
routes.use("/logs", logsRoutes);

module.exports = routes;
