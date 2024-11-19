// import dotenv from "dotenv";
// import createApp from "./subserver/subserver";
// import sequelize from "../dbconfig/dbconfig";
// import Product from "../modals/Product/Product";
// import User from "../modals/User/User"
// import Token from "../modals/Token/Token"
// dotenv.config();
// const port = process.env.PORT || 4000;
// const app = createApp();

// // sequelize
// //   .sync()
// //   .then(() => {
// //     console.log("connection established");
// //   })
// //   .catch((error: any) => {
// //     console.error(error.message);
// //   });
// const db = async () => {
//   try{
//     await User.sync();
//     await Product.sync();
//     await Token.sync();
//     console.log("connection established");
//   }
//   catch(error:any){
//     console.error(error.message);
//   }
// }
// db();
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

import dotenv from "dotenv";
import createApp from "./subserver/subserver";
import sequelize from "../dbconfig/dbconfig";
import User from "../modals/User/User";
// import Product from "../modals/Product/Product";
import Token from "../modals/Token/Token";
import Candidate from "../modals/Candidate/Candidate";
import Designation from "../modals/Designation/Designation";
// import Contact from '../modals/Contacts/Contact';
// import WorkExperience from '../modals/WorkExperience/WorkExperience';
import Education from "../modals/Eduction/Education";
import ReasonsForLeaving from "../modals/ReasonForLeaving/ReasonForLeaving";
import Tag from "../modals/Tag/Tag";
// import Client from "../modals/Client/Client";
import Region from "../modals/Region/Region";
import CandidateTags from "../modals/CandidateTags/CandidateTags";
import CandidateReasons from "../modals/CandidateReasons/CandidateReasons";
import Client from "../modals/Client/Client";
// Load Environment Variables
dotenv.config();
const port = process.env.PORT || 4000;
const app = createApp();

// Sync Database
const syncDatabase = async () => {
  try {
    // Establish associations

    await User.sync({ alter: true });
    await Token.sync({ alter: true });
    await Tag.sync({ alter: true });
    await ReasonsForLeaving.sync({ alter: true });
    await Designation.sync({ alter: true });
    await Region.sync({ alter: true });
    await Candidate.sync({ alter: true });
    await CandidateTags.sync({ alter: true });
    await CandidateReasons.sync({ alter: true });
    await Education.sync({ alter: true });
    await Client.sync({ alter: true });

    // Sync all models

    console.log("Database synced successfully!");

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error: any) {
    console.error("Error syncing database:", error.message);
  }
};

syncDatabase();
