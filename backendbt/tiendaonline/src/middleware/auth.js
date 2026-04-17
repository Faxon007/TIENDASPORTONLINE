import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";

const SECRET = "secret123";

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1h" });
};

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET);
    req.user = decoded;
    next();
  } catch {
    logger.error("error token");
    res.status(401).json({ message: "Invalid token" });
  }
};