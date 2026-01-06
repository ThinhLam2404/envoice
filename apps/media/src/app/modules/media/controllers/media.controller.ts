import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { UploadFileTcpRequest } from '@common/interfaces/tcp/media';
import { ProcessId } from '@common/decorators/processId.decorator';
import { MediaService } from '../services/media.service';
import { Response } from '@common/interfaces/tcp/common/response.interface';
@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.MEDIA.UPLOAD_FILE)
  async uploadFile(
    @RequestParams() data: UploadFileTcpRequest,
    @ProcessId() processId: string,
  ): Promise<Response<string>> {
    const result = this.mediaService.uploadFile(data, processId);
    return Response.success<string>(result);
  }
}
