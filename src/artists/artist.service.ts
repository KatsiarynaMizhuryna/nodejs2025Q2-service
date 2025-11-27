import { Injectable } from '@nestjs/common';
import { Artist } from './artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { randomUUID } from 'crypto';
import { TrackService } from 'src/tracks/track.service';
import { AlbumService } from 'src/albums/album.service';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];
  constructor(
    private trackService: TrackService,
    private albumService: AlbumService,
  ) {}

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

    this.albumService.findAll().forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });

    this.trackService.findAll().forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });

    this.artists.splice(index, 1);
    return true;
  }
}
