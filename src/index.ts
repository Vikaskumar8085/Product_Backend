import dotenv from "dotenv";
import createApp from "./subserver/subserver";
import sequelize from "../dbconfig/dbconfig";
dotenv.config();
const port = process.env.PORT || 4000;
const app = createApp();
sequelize
  .sync()
  .then(() => {
    console.log("connection established");
  })
  .catch((error: any) => {
    console.error(error.message);
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
