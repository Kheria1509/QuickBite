import express from "express"
import { loginUser, logout, register, refreshToken, verifyToken } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post("/register", register);
userRouter.post("/login", loginUser);
userRouter.post("/logout", authMiddleware, logout);
userRouter.post("/refresh", refreshToken);
userRouter.post("/verify", authMiddleware, verifyToken);

export default userRouter;