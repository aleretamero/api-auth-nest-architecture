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
import { CreateUserDto } from '@/modules/user/dtos/create-user.dto';
import { UserService } from '@/modules/user/user.service';
import { UserDto } from '@/modules/user/dtos/user.dto';
import { UseInterceptorFile } from '@/common/decorators/use-file-interceptor.decorator';
import { File } from '@/infra/storage/storage.service';
import { ParseFilePipe } from '@/common/pipes/parse-file-pipe';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/modules/user/enums/role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiDocs({ tags: 'users', response: [400, 401] })
  async create(
    @Body() body: CreateUserDto,
    @UploadedFile(new ParseFilePipe({ isRequired: false })) file?: File,
  ): Promise<UserDto> {
    return this.userService.create(body, file);
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
    @Body() body: CreateUserDto,
    @UploadedFile(new ParseFilePipe({ isRequired: false })) file?: File,
  ): Promise<UserDto> {
    return this.userService.update(id, body, file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDocs({ tags: 'users', response: [401, 404] })
  async delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }
}