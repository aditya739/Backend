import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = "./public/temp";

// ensure folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
 
});

export const upload = multer({ storage });
