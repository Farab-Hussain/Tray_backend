import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,     
});

// Test the database connection and log the result
pool.connect()
  .then(client => {
    console.log("Database connected successfully");
    client.release();
  })
  .catch(err => {
    console.error("Error connecting to the database:", err);
  });

export default pool;