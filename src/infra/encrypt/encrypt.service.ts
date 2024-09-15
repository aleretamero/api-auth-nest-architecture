import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';

@Injectable()
export class EncryptService {
  private readonly ALGORITHM = 'aes-256-cbc';
  private readonly IV_LENGTH = 16;
  private readonly KEY_LENGTH = 32;

  private getSecretKeyBuffer(secretKey: string): Buffer {
    return Buffer.from(
      secretKey.padEnd(this.KEY_LENGTH, '0').slice(0, this.KEY_LENGTH),
    );
  }

  async encrypt(secretKey: string, text: string): Promise<string> {
    const secretKeyBuffer = this.getSecretKeyBuffer(secretKey);
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGORITHM, secretKeyBuffer, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  async decrypt(secretKey: string, text: string): Promise<string> {
    const secretKeyBuffer = this.getSecretKeyBuffer(secretKey);
    const [iv, encrypted] = text.split(':');
    const decipher = crypto.createDecipheriv(
      this.ALGORITHM,
      secretKeyBuffer,
      Buffer.from(iv, 'hex'),
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
