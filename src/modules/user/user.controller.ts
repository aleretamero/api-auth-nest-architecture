import { ApiDocs } from '@/common/swagger/api-config.swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { UserDto } from '@/modules/user/dtos/user.dto';
import { UseInterceptorFile } from '@/common/decorators/use-file-interceptor.decorator';
import { File } from '@/infra/storage/supabase/supabase.service';
import { ParseFilePipe } from '@/common/pipes/parse-file-pipe';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/modules/user/enums/role.enum';
import { CreateUserDto } from '@/modules/user/dtos/create-user.dto';
import { UpdateUserDto } from '@/modules/user/dtos/update-user.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/modules/user/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseInterceptorFile('file')
  @ApiDocs({ tags: 'users', response: [400, 401] })
  async create(
    @Body() body: CreateUserDto,
    @UploadedFile(new ParseFilePipe({ isRequired: false })) file?: File,
  ): Promise<UserDto> {
    return this.userService.create(body, file?.filename);
  }

  @Get()
  @ApiDocs({ tags: 'users', response: [401] })
  async index(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiDocs({ tags: 'users', response: [401, 404] })
  async show(@Param('id') id: string): Promise<UserDto> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptorFile('file')
  @ApiDocs({ tags: 'users', response: [400, 401, 404] })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @UploadedFile(new ParseFilePipe({ isRequired: false })) file?: File,
  ): Promise<UserDto> {
    return this.userService.update(id, body, file?.filename);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDocs({ tags: 'users', response: [401, 404] })
  async delete(
    @CurrentUser() currentUser: User,
    @Param('id') id: string,
  ): Promise<void> {
    return this.userService.delete(currentUser, id);
  }
}
