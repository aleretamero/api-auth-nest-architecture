import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  private readonly salt: number = 10;

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
