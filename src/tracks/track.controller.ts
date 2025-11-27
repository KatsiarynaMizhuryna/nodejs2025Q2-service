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
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TrackController {
  constructor(private service: TrackService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const track = this.service.findOne(id);
    if (!track) throw new NotFoundException();
    return track;
  }

  @Post()
  create(@Body() dto: CreateTrackDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTrackDto) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const updated = this.service.update(id, dto);
    if (!updated) throw new NotFoundException();
    return updated;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const ok = this.service.delete(id);
    if (!ok) throw new NotFoundException();
    return;
  }
}
