import dotenv from "dotenv";
import createApp from "./subserver/subserver";
dotenv.config();

const port = process.env.PORT || 4000;
const app = createApp();

app.listen(port, () => {
  console.log(`Server started on PORT ${port}`);
});
