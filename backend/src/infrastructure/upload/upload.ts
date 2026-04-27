import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';

const uploadsDir = path.join(process.cwd(), 'uploads');

interface CustomFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

const storage = multer.diskStorage({
  destination: (req: Express.Request, file: CustomFile, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadsDir);
  },
  filename: (req: Express.Request, file: CustomFile, cb: (error: Error | null, filename: string) => void) => {
    const uniqueName = `${randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req: Express.Request, file: CustomFile, cb: FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo inválido. Apenas imagens são permitidas.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  }
});

export const uploadConfig = {
  uploadsDir,
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ],
  maxFileSize: 5 * 1024 * 1024,
  maxFiles: 10
};

export function setupUploads(app: any) {
  const fs = require('fs');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}