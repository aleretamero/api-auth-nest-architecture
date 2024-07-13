import * as path from 'node:path';
import environment from '@/configs/environment';
import { Injectable } from '@nestjs/common';
import { SupabaseProvider } from '@/infra/storage/supabase/supabase.provider';
import { FileSystem } from '@/common/helpers/file-system';

export type Uploadable =
  | {
      constructor: {
        name: string;
      };
    }
  | string;

export type File = Express.Multer.File;

export type Output = {
  path: string;
  publicUrl: string;
};

@Injectable()
export class SupabaseService {
  constructor(private readonly client: SupabaseProvider) {}

  async uploadFile(uploadable: Uploadable, file: File): Promise<Output> {
    const bucket = await this.getOrCreateBucket(uploadable);

    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(file.filename, file.buffer, {
        upsert: true,
      });

    if (error) {
      console.error('Error uploading file', error);
      throw new Error('Error uploading file');
    }

    const publicUrl = await this.getPublicUrl(uploadable, data.path);

    return { path: data.path, publicUrl };
  }

  async uploadFileFromPath(
    uploadable: Uploadable,
    pathName: string,
  ): Promise<Output> {
    const filePath = path.resolve(__dirname, '../../../uploads', pathName);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const buffer = FileSystem.getStream(filePath);
    // const bucket = await this.getOrCreateBucket(uploadable);

    console.log(filePath);

    // const { data, error } = await this.client.storage
    //   .from(bucket)
    //   .upload(pathName, buffer, {
    //     upsert: true,
    //   });

    // if (error) {
    //   console.error('Error uploading file', error);
    //   throw new Error('Error uploading file');
    // }

    // const publicUrl = await this.getPublicUrl(uploadable, data.path);

    // return { path: data.path, publicUrl };
    return { path: pathName, publicUrl: '' };
  }

  async deleteFile(uploadable: Uploadable, path: string): Promise<void> {
    const { error } = await this.client.storage
      .from(this.extractBucket(uploadable))
      .remove([path]);

    if (error) {
      throw new Error('Error deleting file');
    }
  }

  private async getOrCreateBucket(uploadable: Uploadable): Promise<string> {
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
    uploadable: Uploadable,
    path: string,
  ): Promise<string> {
    const { data } = this.client.storage
      .from(this.extractBucket(uploadable))
      .getPublicUrl(path);

    return data.publicUrl;
  }

  private extractBucket(uploadable: Uploadable): string {
    const stage = this.stage();
    let uploadableName: string;

    if (typeof uploadable === 'string') {
      uploadableName = uploadable;
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
