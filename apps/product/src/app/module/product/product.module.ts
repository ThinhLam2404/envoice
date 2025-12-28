import { Module } from '@nestjs/common';
import { TypeOrmProvider } from '@common/configuration/type-orm.config';

@Module({
  imports: [TypeOrmProvider],
  controllers: [],
  providers: [],
  exports: [],
})
export class ProductModule {}
