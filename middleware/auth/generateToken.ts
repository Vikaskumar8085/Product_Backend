import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const generateToken = async (id: any) => {
  const token = await jwt.sign({ id: id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
  return token;
};
export default generateToken;
