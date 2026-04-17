import express from "express";
import { register, login } from "./controllers/authController.js";
import { seedProducts, getProducts } from "./controllers/productController.js";
import { addToCart, getCart, removeFromCart, checkout } from "./controllers/cartController.js";
import { authMiddleware } from "./middleware/auth.js";

const router = express.Router();

// auth
router.post("/register", register);
router.post("/login", login);

// products
router.get("/products", getProducts);
router.post("/products/seed", seedProducts);

// cart
router.post("/cart", authMiddleware, addToCart);
router.get("/cart", authMiddleware, getCart);
router.delete("/cart", authMiddleware, removeFromCart);
router.post("/checkout", authMiddleware, checkout);

export default router;