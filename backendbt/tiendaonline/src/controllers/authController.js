import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { db } from "../utils/db.js";
import { generateToken } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);
    
    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const user = { id: uuid(), email, password: hashed };
    db.users.push(user);

    res.json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

export const login = async (req, res) => {
   try {
    const { email, password } = req.body;

    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login error" });
  }
};