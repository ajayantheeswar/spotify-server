import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer/interceptors/file-fields.interceptor';
import { AdminService } from './admin.service';



@Controller('/admin')
export class AlbumController {
    constructor(private album: AdminService){}

    @Get('/get-all-artist') 
    async getAllArtist() {
      return await this.album.getAllArtists() 
    }

    @Get('/get-all-gerne')
    async getAllgGerne() {
        return await this.album.getAllGerne()
    }

    @Get('/get-pre-album')
    async getPreAlbum() {
      const [artists,languages,gernes] = await Promise.all([
        await this.album.getAllArtists(),
        await this.album.getAllLanguage(),
        await this.album.getAllGerne()
      ])

      return {
        artists,
        languages,
        gernes
      }

    }

    @Post('/create-album')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'AlbumImage', maxCount: 1 },
      { name: 'track', maxCount: 25 },
    ]))
    async postCreateAlbum(@UploadedFiles() files ,@Body() body) {

      const data = JSON.parse(body.data)
      const AlbumImage = files.AlbumImage[0]
      const trackFiles = files.track
      const trackData = data.TrackFilesData
      const trackArtistsData = data.TrackArtistList

      const album = await this.album.createAlbum(data.album,AlbumImage);
      const tracksURLs = await this.album.UploadTracks(trackFiles)
      const tracks = await this.album.createTracks(trackData,album.image_url,tracksURLs,album.id)

      const track_artist = [] as any
      for(let i=0;i<tracks.length;i++){
        trackArtistsData[i].forEach(artist => {
          track_artist.push({
            track_id : tracks[i].id,
            artist_id : artist
          })
        })
      }

      await this.album.createTrackArtist(track_artist);

      return {
        album
      }
    }

}