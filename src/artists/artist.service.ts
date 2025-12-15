import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateArtistDto) {
    return this.prisma.artist.create({
      data: {
        name: dto.name,
        grammy: dto.grammy,
      },
    });
  }

  async findAll() {
    return this.prisma.artist.findMany({
      include: {
        albums: true,
        tracks: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.artist.findUnique({
      where: { id },
      include: {
        albums: true,
        tracks: true,
      },
    });
  }

  async update(id: string, dto: UpdateArtistDto) {
    try {
      return await this.prisma.artist.update({
        where: { id },
        data: {
          name: dto.name,
          grammy: dto.grammy,
        },
      });
    } catch {
      return null;
    }
  }

  async delete(id: string) {
    await this.prisma.album.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });

    await this.prisma.track.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });

    try {
      await this.prisma.artist.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
