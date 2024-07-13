import * as path from 'node:path';
import { FileSystem } from '@/common/helpers/file-system';
import environment from '@/configs/environment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStorageService {
  getUrl(fileName: string): string {
    return `${environment.BASE_URL}/uploads/${fileName}`;
  }

  getStream(fileName: string): Buffer {
    const filePath = path.resolve(__dirname, '../../../../uploads', fileName);

    return FileSystem.getStream(filePath);
  }

  removeFile(fileName: string): void {
    const filePath = path.resolve(__dirname, '../../../../uploads', fileName);

    FileSystem.deleteFile(filePath);
  }
}
