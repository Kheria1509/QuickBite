import 'dotenv/config'; // Must be the first import
import express from "express"
import cors from "cors"
import connectDB  from "./config/dp.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import cookieParser from "cookie-parser";

//app config
const app = express()
const port = process.env.PORT || 4000

// Debug environment variables
console.log("Environment variables loaded:", {
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Not set",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ? "Set" : "Not set",
});

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'], // Frontend origins
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'Origin', 'Accept']
};

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// db connection
connectDB();

// Authentication routes
app.use("/api/auth", userRouter);

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
    res.send("Api working");
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

//