// import multer from "multer";
// import { Request } from "express";

// const storage = multer.diskStorage({
//   destination: (req: Express.Request, file: FileReader, cb: any) => {
//     cb(null, "/uploads");
//   },
//   filename: (req: Request, file: FileReader, cb: any) => {
//     cb(null, new Date.now() + "-" + file?.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.metatype === "image/jpg" ||
//     file.metatype === "image/png" ||
//     file.metatype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// const upload = multer({ storage: storage }, fileFilter);
// module.exports = upload;
