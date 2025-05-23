import 'dotenv/config'; // Must be the first import
import express from "express"
import cors from "cors"
import connectDB  from "./config/dp.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import cookieParser from "cookie-parser";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//app config
const app = express()
const PORT = process.env.PORT || 4000

// Debug environment variables
console.log("Environment variables loaded:", {
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Not set",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ? "Set" : "Not set",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "Set" : "Not set"
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory...');
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Determine allowed origins based on environment
const getAllowedOrigins = () => {
  const origins = [
    'https://quick-bite-ecru-five.vercel.app',
    'https://quickbite-admin.vercel.app'
  ];

  if (process.env.NODE_ENV === 'development') {
    origins.push(
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5176'
    );
  }

  return origins;
};


// CORS configuration
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = getAllowedOrigins();
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origin blocked:', origin);
      callback(null, false);
    }
  },
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
app.get('/images/:filename', (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
    res.send("Api working");
});

// Only start the server if not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app for serverless environments
export default app;

//