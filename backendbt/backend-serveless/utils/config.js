import 'dotenv/config'; 
export default {
  dbMode: process.env.DB_MODE || "memory",
};