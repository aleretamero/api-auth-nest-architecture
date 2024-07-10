import { ApiResponse } from '@/common/swagger/api-config.swagger';
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
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '@/modules/user/dtos/create-user.dto';
import { UserPresenter } from '@/modules/user/presenters/user.presenter';
import { UserService } from '@/modules/user/user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({ status: [400, 401] })
  async create(@Body() body: CreateUserDto): Promise<UserPresenter> {
    return this.userService.create(body);
  }

  @Get()
  @ApiResponse({ status: 401 })
  async index(): Promise<UserPresenter[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: [401, 404] })
  async show(@Param('id') id: string): Promise<UserPresenter> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: [400, 401, 404] })
  async update(
    @Param('id') id: string,
    @Body() body: CreateUserDto,
  ): Promise<UserPresenter> {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: [401, 404] })
  async delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }
}
