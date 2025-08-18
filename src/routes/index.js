const { Router } = require("express");
const authRoutes = require("./auth");
const usersRoutes = require("./users");

const routes = Router();

routes.get("/", (req, res) => {
  res.json({ 
    message: "SPS Server API", 
    version: "1.0.0",
    endpoints: {
      auth: "/auth/login",
      users: "/users"
    }
  });
});

routes.use("/auth", authRoutes);
routes.use("/users", usersRoutes);

module.exports = routes;
