import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isEmail } from 'class-validator';

@Injectable()
export class ParseEmailPipe implements PipeTransform {
  transform(value: any) {
    if (!isEmail(value)) {
      throw new BadRequestException(`Invalid email address: ${value}`);
    }
    return value;
  }
}
