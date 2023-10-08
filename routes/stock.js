import express from "express";
import * as stocks from "../controllers/stock.js";
import jwtToken from "../middleware/Jwt.js";

const router = express.Router();

// post request
// router.post('/addStock',stocks.addStock);
// router.post('/priceUpdate',stocks.priceUpdate);
router.post('/suscribeUpdate',stocks.subscriberUpdate);

// get request
router.get('/availlist', jwtToken,stocks.stockList);


export default router;