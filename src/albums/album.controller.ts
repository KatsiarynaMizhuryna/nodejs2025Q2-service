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
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const album = this.service.findOne(id);
    if (!album) throw new NotFoundException();
    return album;
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateAlbumDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAlbumDto) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const updated = this.service.update(id, dto);
    if (!updated) throw new NotFoundException();

    return updated;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const ok = this.service.delete(id);
    if (!ok) throw new NotFoundException();

    return;
  }
}
