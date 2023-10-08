import express from "express";
import * as auth from "../controllers/auth.js";
import jwtToken from "../middleware/Jwt.js";
const router = express.Router();

// Post routes
router.post("/register", auth.register);
router.post("/login", auth.login);
// Protected route
router.post("/token", jwtToken,auth.token);

// get routes
router.get("/profile",jwtToken,auth.profile);



export default router;