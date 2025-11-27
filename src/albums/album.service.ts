import { Injectable } from '@nestjs/common';
import { Album } from './album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { randomUUID } from 'crypto';
import { TrackService } from 'src/tracks/track.service';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];
  constructor(private trackService: TrackService) {}

  create(dto: CreateAlbumDto) {
    const album: Album = {
      id: randomUUID(),
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId ?? null,
    };
    this.albums.push(album);
    return album;
  }

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    return this.albums.find((a) => a.id === id) || null;
  }

  update(id: string, dto: UpdateAlbumDto) {
    const album = this.albums.find((a) => a.id === id);
    if (!album) return null;

    album.name = dto.name;
    album.year = dto.year;
    album.artistId = dto.artistId ?? null;

    return album;
  }

  delete(id: string) {
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) return false;

    this.trackService.findAll().forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });

    this.albums.splice(index, 1);
    return true;
  }
}
