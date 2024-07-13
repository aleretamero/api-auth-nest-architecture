import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

type ParseFilePipeOptions = {
  acceptMimeTypes?: RegExp;
  isRequired?: boolean;
  maxSizeInMegaByte?: number;
};

@Injectable()
export class ParseFilePipe implements PipeTransform {
  private ONE_MEGA_BYTE = 1000;
  private acceptMimeTypes: RegExp;
  private isRequired: boolean;
  private maxSizeInMegaByte: number;

  constructor(options?: ParseFilePipeOptions) {
    this.acceptMimeTypes = options?.acceptMimeTypes ?? /\.(jp.*|png|webp|pdf)$/;
    this.isRequired = options?.isRequired ?? true;
    this.maxSizeInMegaByte = options?.maxSizeInMegaByte ?? 15;
  }

  transform(value: any) {
    if (!value && !this.isRequired) {
      return value;
    }

    if (!value && this.isRequired) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    if (!value.mimetype?.match(this.acceptMimeTypes)) {
      throw new BadRequestException(
        `O tipo de arquivo .${value?.originalname?.split('.').pop()} não é permitido.`,
      );
    }

    const MAX_SIZE = this.ONE_MEGA_BYTE * this.maxSizeInMegaByte;

    if (!value.size || value.size > MAX_SIZE) {
      throw new BadRequestException();
    }

    return value;
  }
}
