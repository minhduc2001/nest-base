import { Module, Global } from '@nestjs/common';
import { FileService } from '@base/helper/file.service';

@Global()
@Module({
  providers: [FileService],
  exports: [FileService],
})
export class HelperModule {}
