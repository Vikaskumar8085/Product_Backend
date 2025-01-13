import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const generateToken = async (id: any) => {
  const token = await jwt.sign({ id: id }, process.env.JWT_SECRET as string, { expiresIn: "15m" });
  return token;
};
const refreshToken = async (id: any) => {
  const token = await jwt.sign({ id: id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
  return token;
}
export default generateToken;
export { refreshToken };
