import { Injectable } from '@nestjs/common';
import { Artist } from './artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  create(dto: CreateArtistDto) {
    const artist: Artist = {
      id: randomUUID(),
      name: dto.name,
      grammy: dto.grammy,
    };
    this.artists.push(artist);
    return artist;
  }

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    return this.artists.find((a) => a.id === id) || null;
  }

  update(id: string, dto: UpdateArtistDto) {
    const artist = this.artists.find((a) => a.id === id);
    if (!artist) return null;
    artist.name = dto.name;
    artist.grammy = dto.grammy;
    return artist;
  }

  delete(id: string) {
    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.artists.splice(index, 1);
    return true;
  }
}
