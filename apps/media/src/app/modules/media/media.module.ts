import { Module } from '@nestjs/common';
import { MediaController } from './controllers/media.controller';
import { MediaService } from './services/media.service';

@Module({
  imports: [],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [],
})
export class MediaModule {}
