import express from "express";
import UserCtr from "../../controller/UserController/UserCtr";
import verifytoken from "../../middleware/auth/Verifytoken";
const userRouter = express.Router();

userRouter.post("/register", UserCtr.registerCtr);
userRouter.post("/login", UserCtr.loginCtr);
userRouter.get("/profile", UserCtr.profileCtr);
userRouter.post("/forget-password", UserCtr.forgetpasswordCtr);
userRouter.post("/change-password",verifytoken, UserCtr.changePasswordCtr);
userRouter.post("/reset-password/:resetToken", UserCtr.resetpasswordCtr);

export default userRouter;
