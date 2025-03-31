import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import 'dotenv/config';

// Make sure we have environment variables or set defaults
const JWT_SECRET = process.env.JWT_SECRET || "random#secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh#secret#key"; 

// Create access token
const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '2h' }); // Short-lived token
};

// Create refresh token
const createRefreshToken = (id) => {
  return jwt.sign({ id }, JWT_REFRESH_SECRET, { expiresIn: '7d' }); // Longer-lived token
};

// Set cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
};

// Register User
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validate email and password strength
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter strong password" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(Number(process.env.SALT || 10));
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with empty cartData
    const newUser = new userModel({ 
      name, 
      email, 
      password: hashedPassword,
      cartData: {} // Explicitly initialize empty cartData
    });
    
    const user = await newUser.save();
    
    // Create tokens
    const token = createToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    // Store refresh token with user
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    res.cookie('token', token, {
      ...cookieOptions,
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });
    
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error registering user: " + error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    // Initialize cartData if it doesn't exist or is invalid
    if (!user.cartData || typeof user.cartData !== 'object') {
      user.cartData = {};
    }

    // Create tokens
    const token = createToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    // Store refresh token with user
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    res.cookie('token', token, {
      ...cookieOptions,
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });
    
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error logging in: " + error.message });
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Refresh token not found" });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const userId = decoded.id;
    
    // Find user with the refresh token
    const user = await userModel.findById(userId);
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }
    
    // Create new tokens
    const newToken = createToken(user._id);
    const newRefreshToken = createRefreshToken(user._id);
    
    // Update user's refresh token
    user.refreshToken = newRefreshToken;
    await user.save();
    
    // Set new cookies
    res.cookie('token', newToken, {
      ...cookieOptions,
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });
    
    res.cookie('refreshToken', newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    return res.json({ success: true, token: newToken, message: "Token refreshed successfully" });
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Refresh token expired" });
    }
    return res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

// Verify Token
export const verifyToken = async (req, res) => {
  try {
    // User is already authenticated via middleware
    return res.json({ success: true, message: "Token is valid" });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token: " + error.message });
  }
};

// Logout User
export const logout = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user?.id || req.body.userId;
    
    if (userId) {
      // Clear refresh token in database
      const user = await userModel.findById(userId);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
    
    // Clear cookies
    res.clearCookie('token', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
