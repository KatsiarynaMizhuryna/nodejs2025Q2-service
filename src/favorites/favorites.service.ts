import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  private async ensureFavoritesExist() {
    let favs = await this.prisma.favorites.findUnique({ where: { id: 1 } });

    if (!favs) {
      favs = await this.prisma.favorites.create({
        data: { id: 1, artists: [], albums: [], tracks: [] },
      });
    }

    return favs;
  }

  async getAll() {
    const favs = await this.ensureFavoritesExist();

    const [artists, albums, tracks] = await Promise.all([
      this.prisma.artist.findMany({ where: { id: { in: favs.artists } } }),
      this.prisma.album.findMany({ where: { id: { in: favs.albums } } }),
      this.prisma.track.findMany({ where: { id: { in: favs.tracks } } }),
    ]);

    return { artists, albums, tracks };
  }

  async addTrack(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }

    const favs = await this.ensureFavoritesExist();

    if (favs.tracks.includes(id)) {
      return this.getAll();
    }

    await this.prisma.favorites.update({
      where: { id: 1 },
      data: { tracks: [...favs.tracks, id] },
    });

    return this.getAll();
  }

  async removeTrack(id: string) {
    const favs = await this.ensureFavoritesExist();

    if (!favs.tracks.includes(id)) {
      throw new NotFoundException('Track is not in favorites');
    }

    await this.prisma.favorites.update({
      where: { id: 1 },
      data: { tracks: favs.tracks.filter((t) => t !== id) },
    });

    return this.getAll();
  }

  async addAlbum(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }

    const favs = await this.ensureFavoritesExist();

    if (favs.albums.includes(id)) {
      return this.getAll();
    }

    await this.prisma.favorites.update({
      where: { id: 1 },
      data: { albums: [...favs.albums, id] },
    });

    return this.getAll();
  }

  async removeAlbum(id: string) {
    const favs = await this.ensureFavoritesExist();

    if (!favs.albums.includes(id)) {
      throw new NotFoundException('Album is not in favorites');
    }

    await this.prisma.favorites.update({
      where: { id: 1 },
      data: { albums: favs.albums.filter((a) => a !== id) },
    });

    return this.getAll();
  }

  async addArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }

    const favs = await this.ensureFavoritesExist();

    if (favs.artists.includes(id)) {
      return this.getAll();
    }

    await this.prisma.favorites.update({
      where: { id: 1 },
      data: { artists: [...favs.artists, id] },
    });

    return this.getAll();
  }

  async removeArtist(id: string) {
    const favs = await this.ensureFavoritesExist();

    if (!favs.artists.includes(id)) {
      throw new NotFoundException('Artist is not in favorites');
    }

    await this.prisma.favorites.update({
      where: { id: 1 },
      data: { artists: favs.artists.filter((a) => a !== id) },
    });

    return this.getAll();
  }

  async removeDeletedEntity(
    entityType: 'artist' | 'album' | 'track',
    id: string,
  ) {
    const favs = await this.prisma.favorites.findUnique({ where: { id: 1 } });
    if (!favs) return;

    const updates: any = {};

    if (entityType === 'artist' && favs.artists.includes(id)) {
      updates.artists = favs.artists.filter((a) => a !== id);
    } else if (entityType === 'album' && favs.albums.includes(id)) {
      updates.albums = favs.albums.filter((a) => a !== id);
    } else if (entityType === 'track' && favs.tracks.includes(id)) {
      updates.tracks = favs.tracks.filter((t) => t !== id);
    }

    if (Object.keys(updates).length > 0) {
      await this.prisma.favorites.update({
        where: { id: 1 },
        data: updates,
      });
    }
  }
}
