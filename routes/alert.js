import express from "express";
import * as alert from "../controllers/alert.js";
import jwtToken from "../middleware/Jwt.js";

const router = express.Router();

// post request
router.post('/create', jwtToken, alert.createAlert);
router.post('/delete', jwtToken, alert.deleteAlert);

// get method
router.get('/list', jwtToken, alert.allAlert);

export default router;