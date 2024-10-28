// src/db.ts
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Initialize Sequelize connection
const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    logging: false, // Enable logging for SQL queries if needed
  }
);

// Function to authenticate the database connection
export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the MySQL database on XAMPP successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export const runRawQuery = async () => {
  try {
    // Example raw SQL query to fetch data from a table named 'test_table'
    const [results, metadata] = await sequelize.query(
      "SELECT * FROM test_table;"
    );
    console.log("Query Results:", results);
  } catch (error) {
    console.error("Error executing query:", error);
  }
};

// Export the Sequelize instance for running raw queries
export default sequelize;
