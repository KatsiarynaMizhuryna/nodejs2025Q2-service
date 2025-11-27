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
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid id');
    }

    const user = this.service.findOne(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePasswordDto) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const result = this.service.update(id, dto);

    if (result === null) throw new NotFoundException();
    if (result === 'WRONG_PASSWORD')
      throw new ForbiddenException('Wrong password');

    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const ok = this.service.delete(id);
    if (!ok) throw new NotFoundException();
    return;
  }
}
