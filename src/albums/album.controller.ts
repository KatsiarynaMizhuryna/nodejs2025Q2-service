import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private service: AlbumService) {}

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const album = await this.service.findOne(id);
    if (!album) throw new NotFoundException();
    return album;
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateAlbumDto) {
    return await this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAlbumDto) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const updated = await this.service.update(id, dto);
    if (!updated) throw new NotFoundException();

    return updated;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const ok = await this.service.delete(id);
    if (!ok) throw new NotFoundException();

    return;
  }
}
