import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getProcessid } from '@common/utils/string.util';
import { MetadataKeys } from '@common/constants/common.constant';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    const startTime = Date.now();
    const { method, originalUrl, body } = req;
    const processId = getProcessid();
    const now = Date.now();

    (req as any)[MetadataKeys.PROCESS_ID] = processId;
    (req as any)[MetadataKeys.START_TIME] = startTime;

    Logger.log(`HTTP ${method} ${originalUrl} - Process ID: ${processId} at ${now} - Body: ${JSON.stringify(body)}`);

    const originalSend = res.send.bind(res);

    res.send = (body: any) => {
      const durationMs = Date.now() - startTime;
      Logger.log(
        `Response for ${method} ${originalUrl} - Process ID: ${processId}- Duration: ${durationMs}ms - Body: ${JSON.stringify(
          body,
        )}`,
      );
      return originalSend(body);
    };

    next();
  }
}
