import { Injectable } from '@nestjs/common';
import { Track } from './track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  create(dto: CreateTrackDto) {
    const track: Track = {
      id: randomUUID(),
      name: dto.name,
      artistId: dto.artistId ?? null,
      albumId: dto.albumId ?? null,
      duration: dto.duration,
    };
    this.tracks.push(track);
    return track;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    return this.tracks.find((t) => t.id === id) || null;
  }

  update(id: string, dto: UpdateTrackDto) {
    const track = this.tracks.find((t) => t.id === id);
    if (!track) return null;

    track.name = dto.name;
    track.artistId = dto.artistId ?? null;
    track.albumId = dto.albumId ?? null;
    track.duration = dto.duration;

    return track;
  }

  delete(id: string) {
    const index = this.tracks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.tracks.splice(index, 1);
    return true;
  }
}
