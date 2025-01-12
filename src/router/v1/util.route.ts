import express from "express";
// import { UploadFile } from "../../controllers";
import multer from "multer";
import crypto from "crypto-js";
const utilRoute = express.Router();

const upload = multer({
    storage: multer.memoryStorage(), // Store the file in memory temporarily
    limits: { fileSize: 10 * 1024 * 1024 * 1000 }, // Limit file size to 20MB
  });
  
// Error handling middleware to handle Multer errors
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'File size exceeds the 20MB limit',
    });
  }
  // Handle other errors
  next(err);
};

const hashFile = (req, res, next) => {
  if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
  }
  const fileBuffer = req.file.buffer;
  const fileHash = crypto.SHA256(fileBuffer.toString('base64')).toString(); 

  req.fileHash = fileHash;
  next();
};


// utilRoute.post('/upload',upload.single('file'),hashFile, UploadFile,multerErrorHandler);

export default utilRoute