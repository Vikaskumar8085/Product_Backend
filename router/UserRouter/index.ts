import express from "express";
import UserCtr from "../../controller/UserController/UserCtr";
import verifytoken from "../../middleware/auth/Verifytoken";
import uploadImage from "../../middleware/UploadImage";
const userRouter = express.Router();

userRouter.post("/register", UserCtr.registerCtr);
userRouter.post("/login", UserCtr.loginCtr);
userRouter.get("/profile",verifytoken, UserCtr.profileCtr);
userRouter.post("/forget-password", UserCtr.forgetpasswordCtr);
userRouter.post("/change-password",verifytoken, UserCtr.changePasswordCtr);
userRouter.post("/reset-password/:resetToken", UserCtr.resetpasswordCtr);
userRouter.put("/update-profile",verifytoken,uploadImage.single('ProfileImage'), UserCtr.editprofileCtr);

export default userRouter;
