import { Controller } from '@nestjs/common';

// APPS
import { UserService } from './user.service';
import { ApiTagsAndBearer } from '@/base/swagger';

@Controller('user')
@ApiTagsAndBearer('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // @Public()
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(
  //   @Body() dto: UploadAvatarDto,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   return this.userService.uploadAvatar({ ...dto, file: file.filename });
  // }
}
