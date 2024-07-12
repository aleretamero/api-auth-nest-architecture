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
} from '@nestjs/common';
import { CreateUserDto } from '@/modules/user/dtos/create-user.dto';
import { UserPresenter } from '@/modules/user/presenters/user.presenter';
import { UserService } from '@/modules/user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiDocs({ tags: 'users', response: [400, 401] })
  async create(@Body() body: CreateUserDto): Promise<UserPresenter> {
    return this.userService.create(body);
  }

  @Get()
  @ApiDocs({ tags: 'users', response: [401] })
  async index(): Promise<UserPresenter[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiDocs({ tags: 'users', response: [401, 404] })
  async show(@Param('id') id: string): Promise<UserPresenter> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiDocs({ tags: 'users', response: [400, 401, 404] })
  async update(
    @Param('id') id: string,
    @Body() body: CreateUserDto,
  ): Promise<UserPresenter> {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDocs({ tags: 'users', response: [401, 404] })
  async delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }
}
