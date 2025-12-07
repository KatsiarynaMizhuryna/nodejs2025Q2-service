import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAlbumDto) {
    return this.prisma.album.create({
      data: {
        name: dto.name,
        year: dto.year,
        artistId: dto.artistId ?? null,
      },
    });
  }

  async findAll() {
    return this.prisma.album.findMany({
      include: { tracks: true, artist: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.album.findUnique({
      where: { id },
      include: { tracks: true, artist: true },
    });
  }

  async update(id: string, dto: UpdateAlbumDto) {
    try {
      return await this.prisma.album.update({
        where: { id },
        data: {
          name: dto.name,
          year: dto.year,
          artistId: dto.artistId ?? null,
        },
      });
    } catch {
      return null;
    }
  }

  async delete(id: string) {
    await this.prisma.track.updateMany({
      where: { albumId: id },
      data: { albumId: null },
    });

    try {
      await this.prisma.album.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
