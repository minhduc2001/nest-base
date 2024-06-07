import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { config } from '@/config';
import { makeUUID } from '@base/helper/function.helper';
import { UnsupportedMediaTypeException } from '@nestjs/common';
import { i18nValidationMessage } from 'nestjs-i18n';

export const multerConfig = {
  dest: config.UPLOAD_LOCATION,
};

// Multer upload options
export const multerOptions = {
  // Enable file size limits
  limits: {
    fileSize: config.MAX_FILE_SIZE,
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (
      file.mimetype.match(/\/(jpg|jpeg|png|gif)$/) ||
      file.mimetype.match(/\.xlsx$/i)
    ) {
      // Allow storage of file
      cb(null, true);
    } else {
      cb(
        new UnsupportedMediaTypeException({
          message: i18nValidationMessage('validation.match_enum', {
            extname: extname(file.originalname),
          }),
        }),
        false,
      );
    }
  },

  // Storage properties
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = multerConfig.dest;

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${makeUUID(file.originalname)}`);
    },
  }),
};
