import { db } from "../utils/db.js";
import { v4 as uuid } from "uuid";
import { logger } from "../utils/logger.js";

export const addToCart = (req, res) => {
  try {
    const userId = req.user.id;
  const { productId, quantity } = req.body;

  const product = db.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (!db.carts[userId]) db.carts[userId] = [];

  db.carts[userId].push({ productId, quantity });
  logger.info("Producto agregado al carrito");
  res.json({ message: "Added to cart" });
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart" });
  }
};

export const getCart = (req, res) => {
  const userId = req.user.id;
  res.json(db.carts[userId] || []);
};

export const removeFromCart = (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  db.carts[userId] = (db.carts[userId] || []).filter(p => p.productId !== productId);

  res.json({ message: "Removed" });
};

export const checkout = (req, res) => {
  try {
    const userId = req.user.id;
  const cart = db.carts[userId] || [];

  for (const item of cart) {
    const product = db.products.find(p => p.id === item.productId);

    if (!product || product.stock < item.quantity) {
      return res.status(400).json({ message: "Stock insufficient" });
    }
  }

  // descontar stock
  cart.forEach(item => {
    const product = db.products.find(p => p.id === item.productId);
    product.stock -= item.quantity;
  });

  db.orders.push({
    id: uuid(),
    userId,
    items: cart,
    date: new Date()
  });

  db.carts[userId] = [];

  console.log("Email enviado (simulado)");
  logger.info("Email enviado (Compra realizada) ");
  res.json({ message: "Compra realizada" });
  } catch (error) {
    res.status(500).json({ message: "Checkout error" });
  }
};