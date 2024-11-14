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

// Import Models
import User from "../modals/User/User";
import Product from "../modals/Product/Product";
import Token from "../modals/Token/Token";
import Candidate from "../modals/Candidate/Candidate";
import Designation from "../modals/Designation/Designation";
// import Contact from '../modals/Contacts/Contact';
// import WorkExperience from '../modals/WorkExperience/WorkExperience';
// import Education from '../modals/Eduction/Education';
import ReasonsForLeaving from "../modals/ReasonForLeaving/ReasonForLeaving";
import Tag from "../modals/Tag/Tag";
import Client from "../modals/Client/Client";

// Load Environment Variables
dotenv.config();
const port = process.env.PORT || 4000;
const app = createApp();

// Establish Associations
const establishAssociations = () => {
  // Candidate and Designation Association
  Designation.hasMany(Candidate, { foreignKey: "designationId" });
  Candidate.belongsTo(Designation, { foreignKey: "designationId" });

  // // Candidate and Contact Association
  // Candidate.hasMany(Contact, { foreignKey: 'candidateId' });
  // Contact.belongsTo(Candidate, { foreignKey: 'candidateId' });

  // // Candidate and WorkExperience Association
  // Candidate.hasOne(WorkExperience, { foreignKey: 'candidateId' });
  // WorkExperience.belongsTo(Candidate, { foreignKey: 'candidateId' });

  // // Candidate and Education Association
  // Candidate.hasOne(Education, { foreignKey: 'candidateId' });
  // Education.belongsTo(Candidate, { foreignKey: 'candidateId' });

  // Candidate and ReasonsForLeaving Association
  Candidate.hasMany(ReasonsForLeaving, { foreignKey: "candidateId" });
  ReasonsForLeaving.belongsTo(Candidate, { foreignKey: "candidateId" });
};

// Sync Database
const syncDatabase = async () => {
  try {
    // Establish associations
    establishAssociations();
    await Tag.sync();
    await Client.sync();
    // Sync all models
    await sequelize.sync(); // Use { force: true } if you want to drop and recreate tables
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
