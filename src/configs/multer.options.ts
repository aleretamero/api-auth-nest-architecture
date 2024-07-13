import * as path from 'node:path';
import * as fs from 'node:fs';
import * as multer from 'multer';
import { BadRequestException } from '@nestjs/common';
import { Code } from '@/common/helpers/code';
import { ClockUtil } from '@/common/helpers/clock-util';

export const multerOptions = {
  storage: multer.diskStorage({
    destination: (
      req: Express.Request,
      file: Express.Multer.File,
      callback,
    ) => {
      const uploadsDir = path.resolve(__dirname, '../../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      callback(null, uploadsDir);
    },

    filename: (
      req: Express.Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void,
    ) => {
      const dateString = ClockUtil.format('');
      const codeString = Code.generate(6);
      callback(null, `${dateString}_${codeString}`);
    },
  }),

  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!file.mimetype.match(/jp.*|png|webp|pdf/)) {
      return callback(
        new BadRequestException(
          `O tipo de arquivo .${file.originalname.split('.').pop()} não é permitido.`,
        ),
        false,
      );
    }
    callback(null, true);
  },
};
