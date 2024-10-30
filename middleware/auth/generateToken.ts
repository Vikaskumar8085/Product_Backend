import jwt from "jsonwebtoken";
const generateToken = async (id: any) => {
  const token = await jwt.sign({ id: id }, "secerate", { expiresIn: "1d" });
  return token;
};
export default generateToken;
