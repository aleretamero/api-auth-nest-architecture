import { multerOptions } from '@/configs/multer.options';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  MulterField,
  MulterOptions,
} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiConsumes } from '@nestjs/swagger';

export function UseInterceptorFile(
  fieldName: string,
  localOptions: MulterOptions | null = multerOptions,
) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, localOptions ? localOptions : undefined),
    ),
    ApiConsumes('multipart/form-data'),
  );
}

export function UseInterceptorFiles(
  uploadFields: MulterField[],
  localOptions: MulterOptions | null = multerOptions,
) {
  return applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor(
        uploadFields,
        localOptions ? localOptions : undefined,
      ),
    ),
    ApiConsumes('multipart/form-data'),
  );
}
