import jwt from "jsonwebtoken";
import 'dotenv/config';

// Make sure we have environment variables or set defaults
const JWT_SECRET = process.env.JWT_SECRET || "random#secret";

const authMiddleware = async (req, res, next) => {
  // Check for token in headers
  const headerToken = req.headers.token || req.headers.authorization?.split(" ")[1];
  // Check for token in cookies
  const cookieToken = req.cookies?.token;
  
  // Use header token or cookie token
  const token = headerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized. Please log in again." });
  }

  try {
    const token_decode = jwt.verify(token, JWT_SECRET);
    req.body.userId = token_decode.id;
    req.user = { id: token_decode.id }; // Store user ID for easier access
    next();
  } catch (error) {
    console.log(error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
        redirect: true, // Custom flag for client-side redirection
      });
    }

    res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
  }
};

// Middleware for admin routes - bypasses authentication
const adminAccessMiddleware = async (req, res, next) => {
  // Set a default admin user ID (this could be fetched from the database in a real app)
  req.body.userId = "admin";
  req.user = { id: "admin", role: "admin" };
  next();
};

export { authMiddleware, adminAccessMiddleware };
export default authMiddleware;