import type { UploadFileTcpRequest } from '@common/interfaces/tcp/media';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MediaService {
  uploadFile(data: UploadFileTcpRequest, processId: string): string {
    Logger.debug({ data });
    return 'File uploaded successfully';
  }
}
