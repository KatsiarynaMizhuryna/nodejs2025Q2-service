import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  BadRequestException,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private service: FavoritesService) {}

  @Get()
  async getAll() {
    return this.service.getAll();
  }

  @Post('track/:id')
  @HttpCode(201)
  async addTrack(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    await this.service.addTrack(id);

    return { message: 'Added' };
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrack(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const ok = await this.service.removeTrack(id);
    if (!ok) throw new NotFoundException();

    return;
  }

  @Post('album/:id')
  @HttpCode(201)
  async addAlbum(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    await this.service.addAlbum(id);

    return { message: 'Added' };
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbum(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const ok = await this.service.removeAlbum(id);
    if (!ok) throw new NotFoundException();

    return;
  }

  @Post('artist/:id')
  @HttpCode(201)
  async addArtist(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    await this.service.addArtist(id);

    return { message: 'Added' };
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtist(@Param('id') id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid id');

    const ok = await this.service.removeArtist(id);
    if (!ok) throw new NotFoundException();

    return;
  }
}
