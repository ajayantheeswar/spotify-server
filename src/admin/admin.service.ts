import { Injectable } from '@nestjs/common';
import {PrismaService} from '../Prisma/prisma.service';
import {StorageService} from '../storage/stotage.service';



@Injectable()
export class AdminService {
    
    constructor(public prisma: PrismaService, public storage: StorageService) {}
    
    async getAllArtists (): Promise<any>{
        const artists = this.prisma.artist.findMany()
        return artists
    }
    
    async getAllGerne (): Promise<any>{
        const gerne = this.prisma.gerne.findMany()
        return gerne
    }

    async getAllLanguage (): Promise<any> {
        return this.prisma.language.findMany()
    }

    async createAlbum(albumDetails: any,imageFile: any){
        
        const image_url = await this.storage.storefile(imageFile) as string;

        return this.prisma.album.create({
            data: {
                image_url,
                album_name : albumDetails.album_name,
                artist : {
                    connect : {
                        id : albumDetails.music_director
                    }
                },
                language_albumTolanguage : {
                    connect : {
                        id : albumDetails.language
                    }
                }
            }
        })
    }

    async UploadTracks (tracks: any) {
        const tracksURL = [] as any
        tracks.forEach(track=> {
            tracksURL.push(this.storage.storefile(track))
        })
        return Promise.all(tracksURL)
    }

    async createTracks (tracksData: any,imageURL: any,trackUrls:any,albumID:any) : Promise<any> {

        const tracks = [] as any
        for(let i=0;i<tracksData.length;i++){
           tracks.push(this.prisma.track.create({
                data : {
                    track_name : tracksData[i].track_name as string,
                    image_url : imageURL as string,
                    track_url : trackUrls[i],
                    album : {
                        connect : {
                            id: albumID
                        }
                    },
                    gerne_gerneTotrack : {
                        connect:{
                            id: tracksData[i].gerne
                        }
                    }
                }
            })
           ) 
           
            
        }
            
        return Promise.all(tracks)
    }

    createTrackArtist(track_artist: any) {
        const tracks = [] as any

        track_artist.forEach(track => {
            tracks.push(this.prisma.track_artist.create({
                data :{
                    artist : {
                        connect: {
                            id: track.artist_id
                        }
                    },
                    track: {
                        connect : {
                            id: track.track_id
                        }
                    }
                }
            }))
        });

        return Promise.all(tracks)

    }
    

}

/*
    type albumCreateInput {
  id?: String
  album_name: String
  image_url?: String
  language_albumTolanguage?: languageCreateOneWithoutAlbumInput
  artist?: artistCreateOneWithoutAlbumInput
  track?: trackCreateManyWithoutAlbumInput
}


*/