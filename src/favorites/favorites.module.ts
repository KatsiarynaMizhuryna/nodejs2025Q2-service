import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { TrackModule } from 'src/tracks/track.module';
import { ArtistModule } from 'src/artists/artist.module';
import { AlbumModule } from 'src/albums/album.module';

@Module({
  imports: [TrackModule, ArtistModule, AlbumModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
