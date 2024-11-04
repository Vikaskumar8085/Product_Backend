import express from "express";
import UserCtr from "../../controller/UserController/UserCtr";
const userRouter = express.Router();

userRouter.post("/register", UserCtr.registerCtr);
userRouter.post("/login", UserCtr.loginCtr);
userRouter.get("/profile", UserCtr.profileCtr);
userRouter.post("/forget-password", UserCtr.forgetpasswordCtr);
userRouter.post("/change-password", UserCtr.changePasswordCtr);
userRouter.post("/reset-password", UserCtr.resetpasswordCtr);

export default userRouter;
