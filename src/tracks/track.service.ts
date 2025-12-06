import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTrackDto) {
    return this.prisma.track.create({
      data: {
        name: dto.name,
        artistId: dto.artistId ?? null,
        albumId: dto.albumId ?? null,
        duration: dto.duration,
      },
    });
  }

  async findAll() {
    return this.prisma.track.findMany({
      include: { artist: true, album: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.track.findUnique({
      where: { id },
      include: { artist: true, album: true },
    });
  }

  async update(id: string, dto: UpdateTrackDto) {
    try {
      return await this.prisma.track.update({
        where: { id },
        data: {
          name: dto.name,
          artistId: dto.artistId ?? null,
          albumId: dto.albumId ?? null,
          duration: dto.duration,
        },
      });
    } catch {
      return null;
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.track.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
