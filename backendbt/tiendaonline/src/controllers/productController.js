import { db } from "../utils/db.js";
import { v4 as uuid } from "uuid";
import { logger } from "../utils/logger.js";

export const seedProducts = (req, res) => {
  db.products = [
    {
      id: uuid(),
      name: "Balón fútbol",
      category: "futbol",
      price: 25,
      stock: 10,
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b"
    },
    {
      id: uuid(),
      name: "Tenis running",
      category: "running",
      price: 80,
      stock: 5,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    },
    {
      id: uuid(),
      name: "Guantes gimnasio",
      category: "gym",
      price: 15,
      stock: 20,
      image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e"
    },
    {
      id: uuid(),
      name: "Bicicleta",
      category: "ciclismo",
      price: 300,
      stock: 3,
      image: "https://images.unsplash.com/photo-1508973378895-9d0e8a1f6d3b"
    },
    {
      id: uuid(),
      name: "Raqueta tenis",
      category: "tenis",
      price: 120,
      stock: 6,
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b"
    }
  ];

  res.json({ message: "Products seeded" });
};

export const getProducts = (req, res) => {
  try {
    let { page = 1, limit = 5, category } = req.query;
  
  logger.info("Recuperando productos.........")
  page = parseInt(page);
  limit = parseInt(limit);

  let data = db.products;

  if (category) {
    data = data.filter(p => p.category === category);
  }

  const start = (page - 1) * limit;
  const end = start + limit;

  res.json({
    total: data.length,
    page,
    data: data.slice(start, end)
  });
   } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};