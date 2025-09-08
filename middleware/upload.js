import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads folder if it doesn't exist
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Only accept images and videos
const fileFilter = (req, file, cb) => {
  if (/image|video/.test(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type. Only images and videos allowed."));
};

export const upload = multer({ storage, fileFilter });
