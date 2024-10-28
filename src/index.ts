// import dotenv from "dotenv";
// import createApp from "./subserver/subserver";
// import sequelize, { connectToDatabase } from "../dbconfig/dbconfig";
// dotenv.config();

// const port = process.env.PORT || 4000;
// const app = createApp();

// const runTestQuery = async () => {
//   try {
//     // Example raw SQL query
//     const [results, metadata] = await sequelize.query(
//       "SELECT * FROM some_table;"
//     );
//     console.log("Query Results:", results);
//   } catch (error) {
//     console.error("Error executing query:", error);
//   }
// };

// export default runTestQuery;

// const startServer = async () => {
//   await connectToDatabase(); // Connect to the database
//   await runTestQuery(); // Run a test query

//   app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
//     console.log("me");
//   });
// };

// startServer();

// src/server.ts
import dotenv from "dotenv";
import express from "express";
import { connectToDatabase, runRawQuery } from "../dbconfig/dbconfig";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const startServer = async () => {
  await connectToDatabase(); // Connect to the database
  await runRawQuery(); // Run a test query

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();
