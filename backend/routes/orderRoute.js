import express from "express"
import authMiddleware, { adminAccessMiddleware } from "../middleware/auth.js"
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder } from "../controllers/orderController.js";
const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/status",adminAccessMiddleware,updateStatus);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.get("/list",adminAccessMiddleware,listOrders);

export default orderRouter;