import { v4 as uuid } from 'uuid';

let db = {
  users: [
    {
      id: uuid(),
      email: "admin@test.com",
      password: "123456",
    },
  ],
  products: [],
  carts: {},
  orders: [],
};

export const seedProducts = () => {
  db.products = [
    {
      id: uuid(),
      name: "Balón fútbol",
      category: "futbol",
      price: 25,
      stock: 10,
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    },
    {
      id: uuid(),
      name: "Tenis running",
      category: "running",
      price: 80,
      stock: 5,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    },
    {
      id: uuid(),
      name: "Guantes gimnasio",
      category: "gym",
      price: 15,
      stock: 20,
      image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e",
    },
    {
      id: uuid(),
      name: "Bicicleta",
      category: "ciclismo",
      price: 300,
      stock: 3,
      image: "https://images.unsplash.com/photo-1508973378895-9d0e8a1f6d3b",
    },
    {
      id: uuid(),
      name: "Raqueta tenis",
      category: "tenis",
      price: 120,
      stock: 6,
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    },
  ];
};

seedProducts();

export const users = db.users;
export const products = db.products;
export const carts = db.carts;
export const orders = db.orders;
export { db };