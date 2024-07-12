import environment from '@/configs/environment';
import { Injectable } from '@nestjs/common';
import { StorageProvider } from '@/infra/storage/storage.provider';

namespace StorageService {
  export type Uploadable =
    | {
        id: string;
        constructor: {
          name: string;
        };
      }
    | {
        id: string;
        name: string;
      };

  export type File = Express.Multer.File;

  export type Output = {
    path: string;
    publicUrl: string;
  };
}

@Injectable()
export class StorageService {
  constructor(private readonly client: StorageProvider) {}

  async uploadFile(
    uploadable: StorageService.Uploadable,
    file: StorageService.File,
  ): Promise<StorageService.Output> {
    const bucket = await this.getOrCreateBucket(uploadable);
    const isoDateNow = new Date().toISOString();

    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(`${uploadable.id}_${isoDateNow}`, file.buffer, {
        upsert: true,
      });

    if (error) {
      console.error('Error uploading file', error);
      throw new Error('Error uploading file');
    }

    const publicUrl = await this.getPublicUrl(uploadable, data.path);

    return { path: data.path, publicUrl };
  }

  async deleteFile(
    uploadable: StorageService.Uploadable,
    path: string,
  ): Promise<void> {
    const { error } = await this.client.storage
      .from(this.extractBucket(uploadable))
      .remove([path]);

    if (error) {
      throw new Error('Error deleting file');
    }
  }

  private async getOrCreateBucket(
    uploadable: StorageService.Uploadable,
  ): Promise<string> {
    const bucket = this.extractBucket(uploadable);
    const buckets = (await this.client.storage.listBuckets()).data;

    if (buckets?.some((x) => x.name === bucket)) {
      return bucket;
    } else {
      await this.client.storage.createBucket(bucket);
      return bucket;
    }
  }

  private async getPublicUrl(
    uploadable: StorageService.Uploadable,
    path: string,
  ): Promise<string> {
    const { data } = this.client.storage
      .from(this.extractBucket(uploadable))
      .getPublicUrl(path);

    return data.publicUrl;
  }

  private extractBucket(uploadable: StorageService.Uploadable): string {
    const stage = this.stage();
    let uploadableName: string;

    if ('name' in uploadable) {
      uploadableName = uploadable.name;
    } else {
      uploadableName = uploadable.constructor.name;
    }

    return `${stage}-${uploadableName}`.toUpperCase();
  }

  private stage() {
    switch (environment.NODE_ENV) {
      case 'test':
        return 'TEST';
      case 'production':
        return 'PROD';
      case 'development':
        return 'DEV';
      default:
        throw new Error('Invalid environment variable');
    }
  }
}
