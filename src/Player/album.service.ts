import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {PrismaService} from '../Prisma/prisma.service'

@Injectable()
export class AlbumService {
    
    constructor(public prisma: PrismaService) {}
    
    async getAlbumByID(albumID: any) {
        const album = await this.prisma.album.findOne({
            where :{
                id : albumID
            },
            include : {
                track : {
                    include:{
                        gerne_gerneTotrack : true,
                        track_artist : {
                            include : {
                                artist : true
                            }
                        }
                    }
                },
                language_albumTolanguage:true,
                artist: true,
            }
        })
        if(!album) {
            throw new HttpException({
                code: HttpStatus.NOT_FOUND,
                error : "The Album Not Found"
            },HttpStatus.NOT_FOUND)
        }
        return album
    }

    async getAlbumByLanguage(languageID: any,limit: any,skip: any){

        const limitA = limit ? +limit : 15;
        const Skip = skip ? +skip : 0;

        const albums = await this.prisma.album.findMany({
            where:{
                language_albumTolanguage : {
                    id : languageID
                },
            }, 
            skip : Skip,
            take : limitA,
            include : {
                artist : true
            }
            
        })

        if(!albums){
            throw new HttpException({
                code: HttpStatus.NOT_FOUND,
                error : "The Album Not Found"
            },HttpStatus.NOT_FOUND)
        }

        return albums
    }

    async getSongsByArtist(artistID: any,limit?: any,skip?: any){

        const limitA = limit ? +limit : 15;
        const Skip = skip ? +skip : 0;

        const songs = await this.prisma.track_artist.findMany({
            where : {
                artist_id : artistID
            },
            include : {
                track : {
                    include:{
                        gerne_gerneTotrack : true,
                    }
                },
            }, 
            skip : Skip,
            take : limitA
        })

        if(!songs){
            throw new HttpException({
                code: HttpStatus.NOT_FOUND,
                error : "The Songs Not Found"
            },HttpStatus.NOT_FOUND)
        }

        return songs.map(song => {
            const updatedData =  {...song.track}
            return{...updatedData,gerne_name:updatedData.gerne_gerneTotrack.gerne_name}
        })
    }

    async getAllLanguages() {
        return await this.prisma.language.findMany()
    }

}