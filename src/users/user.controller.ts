import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const user = await this.service.findOne(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateUserDto) {
    return await this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePasswordDto) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const result = await this.service.updatePassword(id, dto);

    if (result === null) throw new NotFoundException();
    if (result === 'WRONG_PASSWORD')
      throw new ForbiddenException('Wrong password');

    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const ok = await this.service.delete(id);
    if (!ok) throw new NotFoundException();
    return;
  }
}
