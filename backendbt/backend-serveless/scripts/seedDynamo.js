import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import docClient from "../utils/dbClient.js";

const products = [
  { id: uuid(), name: "Balón Pro", category: "futbol", price: 45, stock: 15, image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500" },
  { id: uuid(), name: "Zapatillas Trail", category: "running", price: 110, stock: 8, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500" },
  { id: uuid(), name: "Mesa Ping Pong", category: "tenis", price: 450, stock: 2, image: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=500" },
  { id: uuid(), name: "Set de Pesas", category: "gym", price: 150, stock: 10, image: "https://images.unsplash.com/photo-1583454110551-21f2fa2ec617?w=500" },
  { id: uuid(), name: "Casco Ciclismo", category: "ciclismo", price: 60, stock: 12, image: "https://images.unsplash.com/photo-1557685888-2d3d303eb90a?w=500" },
  { id: uuid(), name: "Gorra Deportiva", category: "accesorios", price: 20, stock: 30, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500" },
  { id: uuid(), name: "Saco de Boxeo", category: "combate", price: 90, stock: 5, image: "https://images.unsplash.com/photo-1599058918144-1ffabb6ab9a0?w=500" },
  { id: uuid(), name: "Tapete Yoga", category: "gym", price: 30, stock: 25, image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500" },
  { id: uuid(), name: "Red de Voleibol", category: "voley", price: 55, stock: 4, image: "https://images.unsplash.com/photo-1592656094267-764a45160876?w=500" },
  { id: uuid(), name: "Cronómetro Digital", category: "accesorios", price: 12, stock: 50, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500" }
];

const seedProducts = async () => {
  console.log("Iniciando carga de productos...");
  
  for (const product of products) {
    try {
      await docClient.put({
        TableName: "Products",
        Item: product,
      }).promise();
      console.log(`Producto cargado: ${product.name}`);
    } catch (error) {
      console.error(`Error cargando ${product.name}:`, error.message);
    }
  }
  
  console.log("Proceso de carga finalizado.");
};

seedProducts();