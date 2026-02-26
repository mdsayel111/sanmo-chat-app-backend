// import multer, { FileFilterCallback } from "multer";
// import path from "path";
// import fs from "fs";
// import { Request } from "express";

// export interface UploadOptions {
//   destination?: string;
//   maxSize?: number; // in bytes
//   allowedTypes?: string[];
// }

// /**
//  * Ensure directory exists
//  */
// const ensureDir = (dirPath: string): void => {
//   if (!fs.existsSync(dirPath)) {
//     fs.mkdirSync(dirPath, { recursive: true });
//   }
// };

// /**
//  * Create a configured multer uploader
//  */
// export const createUploader = ({
//   destination = "uploads",
//   maxSize = 5 * 1024 * 1024, // 5MB
//   allowedTypes = ["image/jpeg", "image/png", "image/webp"],
// }: UploadOptions = {}) => {
//   ensureDir(destination);

//   const storage = multer.diskStorage({
//     destination: (
//       req: Request,
//       file: Express.Multer.File,
//       cb: (error: Error | null, destination: string) => void
//     ) => {
//       cb(null, destination);
//     },
//     filename: (
//       req: Request,
//       file: Express.Multer.File,
//       cb: (error: Error | null, filename: string) => void
//     ) => {
//       const uniqueSuffix = `${Date.now()}-${Math.round(
//         Math.random() * 1e9
//       )}`;
//       const ext = path.extname(file.originalname);
//       cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
//     },
//   });

//   const fileFilter = (
//     req: Request,
//     file: Express.Multer.File,
//     cb: FileFilterCallback
//   ) => {
//     if (!allowedTypes.includes(file.mimetype)) {
//       cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`));
//       return;
//     }
//     cb(null, true);
//   };

//   return multer({
//     storage,
//     limits: { fileSize: maxSize },
//     fileFilter,
//   });
// };


import multer from "multer";
import type { Request } from "express";
import path from "path";
import fs from "fs";

export interface UploadOptions {
  destination?: string;
  maxSize?: number;
  allowedTypes?: string[];
}

const ensureDir = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const createUploader = ({
  destination = "uploads",
  maxSize = 5 * 1024 * 1024,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
}: UploadOptions = {}) => {
  ensureDir(destination);

  const storage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
      cb(null, destination);
    },

    filename: (req: Request, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}`;
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });

  const fileFilter: multer.Options["fileFilter"] = (
    req,
    file,
    cb
  ) => {
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`));
      return;
    }
    cb(null, true);
  };

  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter,
  });
};