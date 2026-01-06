import type { UploadFileTcpRequest } from '@common/interfaces/tcp/media';
import { Injectable, Logger } from '@nestjs/common';
import { CloudinaryService } from '../../cloudinary/services/cloudinary.service';

@Injectable()
export class MediaService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  uploadFile(data: UploadFileTcpRequest, processId: string): Promise<string> {
    return this.cloudinaryService.uploadFile(Buffer.from(data.fileBase64, 'base64'), data.fileName);
  }
}
