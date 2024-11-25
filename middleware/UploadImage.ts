import multer from 'multer';
import path from 'path';

// Storage Configuration for Profile Images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profileImages/'); // Folder for profile images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

// File Filter for Images
const imageFileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png/; // Allowed file types
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png) are allowed'));
  }
};

// Multer Instance for Images
const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

export default uploadImage;
