import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as Cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
@Injectable()
export class CloudinaryService {
  private readonly cloudinary = Cloudinary;
  constructor(private readonly configService: ConfigService) {
    this.cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CONFIG.CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_CONFIG.API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_CONFIG.API_SECRET'),
    });
  }

  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'uploads',
          public_id: fileName,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            Logger.error('Upload error:', error);
            return reject(error);
          } else {
            Logger.log('Upload successful:', result);
            return resolve(result.secure_url);
          }
        },
      );
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }
}
