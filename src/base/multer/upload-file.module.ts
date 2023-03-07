import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from '@base/multer/multer.config';

@Global()
@Module({
  imports: [MulterModule.register(multerOptions)],
  exports: [MulterModule],
})
export class UploadFileModule {}
