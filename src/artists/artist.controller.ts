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
  HttpCode,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private service: ArtistService) {}

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const artist = await this.service.findOne(id);
    if (!artist) throw new NotFoundException();
    return artist;
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateArtistDto) {
    return await this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateArtistDto) {
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
