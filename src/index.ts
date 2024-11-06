import dotenv from "dotenv";
import createApp from "./subserver/subserver";
import sequelize from "../dbconfig/dbconfig";
import Product from "../modals/Product/Product";
import User from "../modals/User/User"
dotenv.config();
const port = process.env.PORT || 4000;
const app = createApp();

// sequelize
//   .sync()
//   .then(() => {
//     console.log("connection established");
//   })
//   .catch((error: any) => {
//     console.error(error.message);
//   });
const db = async () => {
  try{
    await User.sync();
    await Product.sync();
    console.log("connection established");
  }
  catch(error:any){
    console.error(error.message);
  }
}
db();
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
