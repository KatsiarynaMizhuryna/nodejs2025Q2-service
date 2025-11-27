import { Injectable } from '@nestjs/common';
import { Favorites } from './favorites.entity';
import { TrackService } from 'src/tracks/track.service';
import { ArtistService } from 'src/artists/artist.service';
import { AlbumService } from 'src/albums/album.service';

@Injectable()
export class FavoritesService {
  private favs: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    private trackService: TrackService,
    private artistService: ArtistService,
    private albumService: AlbumService,
  ) {}

  getAll() {
    return {
      artists: this.favs.artists
        .map((id) => this.artistService.findOne(id))
        .filter((a) => a !== null),
      albums: this.favs.albums
        .map((id) => this.albumService.findOne(id))
        .filter((a) => a !== null),
      tracks: this.favs.tracks
        .map((id) => this.trackService.findOne(id))
        .filter((t) => t !== null),
    };
  }

  addTrack(id: string) {
    const exists = this.trackService.findOne(id);
    if (!exists) return 'NOT_FOUND';
    this.favs.tracks.push(id);
  }

  removeTrack(id: string) {
    const index = this.favs.tracks.indexOf(id);
    if (index === -1) return false;
    this.favs.tracks.splice(index, 1);
    return true;
  }

  addAlbum(id: string) {
    const exists = this.albumService.findOne(id);
    if (!exists) return 'NOT_FOUND';
    this.favs.albums.push(id);
  }

  removeAlbum(id: string) {
    const index = this.favs.albums.indexOf(id);
    if (index === -1) return false;
    this.favs.albums.splice(index, 1);
    return true;
  }

  addArtist(id: string) {
    const exists = this.artistService.findOne(id);
    if (!exists) return 'NOT_FOUND';
    this.favs.artists.push(id);
  }

  removeArtist(id: string) {
    const index = this.favs.artists.indexOf(id);
    if (index === -1) return false;
    this.favs.artists.splice(index, 1);
    return true;
  }
}
