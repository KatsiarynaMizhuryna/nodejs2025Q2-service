import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
  HttpCode,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private service: FavoritesService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Post('track/:id')
  @HttpCode(201)
  addTrack(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const result = this.service.addTrack(id);
    if (result === 'NOT_FOUND') throw new UnprocessableEntityException();

    return { message: 'Added' };
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const ok = this.service.removeTrack(id);
    if (!ok) throw new NotFoundException();

    return;
  }

  @Post('album/:id')
  @HttpCode(201)
  addAlbum(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const result = this.service.addAlbum(id);
    if (result === 'NOT_FOUND') throw new UnprocessableEntityException();

    return { message: 'Added' };
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const ok = this.service.removeAlbum(id);
    if (!ok) throw new NotFoundException();

    return;
  }

  @Post('artist/:id')
  @HttpCode(201)
  addArtist(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const result = this.service.addArtist(id);
    if (result === 'NOT_FOUND') throw new UnprocessableEntityException();

    return { message: 'Added' };
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const ok = this.service.removeArtist(id);
    if (!ok) throw new NotFoundException();

    return;
  }
}
