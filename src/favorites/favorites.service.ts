import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const favs = await this.prisma.favorites.findUnique({ where: { id: 1 } });

    if (!favs) {
      return this.prisma.favorites.create({
        data: { artists: [], albums: [], tracks: [] },
      });
    }

    return favs;
  }

  async addTrack(id: string) {
    const favs = await this.getAll();
    if (favs.tracks.includes(id)) return favs;

    return this.prisma.favorites.update({
      where: { id: 1 },
      data: { tracks: [...favs.tracks, id] },
    });
  }

  async removeTrack(id: string) {
    const favs = await this.getAll();
    if (!favs.tracks.includes(id)) return false;

    const updatedTracks = favs.tracks.filter((t) => t !== id);
    await this.prisma.favorites.update({
      where: { id: 1 },
      data: { tracks: updatedTracks },
    });
    return true;
  }

  async addAlbum(id: string) {
    const favs = await this.getAll();
    if (favs.albums.includes(id)) return favs;

    return this.prisma.favorites.update({
      where: { id: 1 },
      data: { albums: [...favs.albums, id] },
    });
  }

  async removeAlbum(id: string) {
    const favs = await this.getAll();
    if (!favs.albums.includes(id)) return false;

    const updatedAlbums = favs.albums.filter((a) => a !== id);
    await this.prisma.favorites.update({
      where: { id: 1 },
      data: { albums: updatedAlbums },
    });
    return true;
  }

  async addArtist(id: string) {
    const favs = await this.getAll();
    if (favs.artists.includes(id)) return favs;

    return this.prisma.favorites.update({
      where: { id: 1 },
      data: { artists: [...favs.artists, id] },
    });
  }

  async removeArtist(id: string) {
    const favs = await this.getAll();
    if (!favs.artists.includes(id)) return false;

    const updatedArtists = favs.artists.filter((a) => a !== id);
    await this.prisma.favorites.update({
      where: { id: 1 },
      data: { artists: updatedArtists },
    });
    return true;
  }
}
