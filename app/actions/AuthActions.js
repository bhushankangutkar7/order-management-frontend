import 'server-only';
import { connectDB } from "../../db/config/ConnectDB.js";
import User from "../../db/models/UserModel.js";
import { generateToken, verifyToken } from "@/utils/server/JwtHelper";

export async function login(email, password) {
  try {
    if (!email || !password) {
      return res.json({
        status: 400,
        success: false,
        message: 'Email and password are required',
      })
    }
    
    await connectDB();
  
    const user = await User.findOne({ email });
  
    const isPasswordValid = verifyToken(password);
  
    if (!user || !isPasswordValid) {
      return res.json({
        status: 401,
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Generate token and return user data
    const token = generateToken(user);
    return {
      status: 200,
      success: true,
      message: 'Login successful',
      token
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      status: 500,
      success: false,
      message: 'Internal server error',
    }
  }
};

export async function register(name, email, password) {
  try {
    if (!name || !email || !password) {
      return res.json({
        status: 400,
        success: false,
        message: 'Name, email and password are required',
      })
    }
    
    await connectDB();
  
    const user = await User.create({ name, email, password });
  
    const token = generateToken(user);
    return {
      status: 201,
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      }
    };

  } catch (error) {
    console.error('Register error:', error);
    return {
      status: 500,
      success: false,
      message: 'Internal server error',
    }
  }
};

