import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer/interceptors/file-fields.interceptor';
import { AlbumService } from './album.service';



@Controller('/admin')
export class AlbumController {
    constructor(private album: AlbumService){}

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
      const AlbumImage = files.AlbumImage
      const trackName = files.track

      console.log(trackName);

      return {
        v : 'a'
      }
    }

}