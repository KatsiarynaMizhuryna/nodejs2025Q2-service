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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TrackController {
  constructor(private service: TrackService) {}

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const track = await this.service.findOne(id);
    if (!track) throw new NotFoundException();
    return track;
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateTrackDto) {
    return await this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTrackDto) {
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
