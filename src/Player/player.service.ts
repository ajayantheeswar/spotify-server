import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { playlist } from '@prisma/client';
import { PrismaService } from '../Prisma/prisma.service'
import { authService } from 'src/auth/auth.service';
import { AlbumService } from './album.service';

@Injectable()
export class PlayerService {
    constructor(public album: AlbumService ,
                public prisma: PrismaService,
                public auth: authService) {}

    async createPlaylist(userID: any , name: string):Promise<any> {
      return await this.prisma.playlist.create({
            data : {
                name : name,
                users : {
                    connect : {
                        id : userID
                    }
                }
            }
        })
    }

    async addTrackToPlaylist(userID: string,playListID: string , trackID: string,):Promise<any> {
        const playlist = await this.prisma.playlist.findOne({
            where : {
                id: playListID
            }
        })

        if(!playlist)
            throw new HttpException({
                code : HttpStatus.NOT_FOUND,
                message : "The Playlist Not Found"
            },HttpStatus.NOT_FOUND)

        if(playlist.userid !== userID) 
            throw new HttpException({
                code : HttpStatus.FORBIDDEN,
                message: "Not Allowed To change Playlist"
            },HttpStatus.FORBIDDEN)
        
        const track_playlist = await this.prisma.track_playlist.create({
            data : {
                track : {
                    connect : {
                        id : trackID
                    }
                },
                playlist : {
                    connect : {
                        id : playListID
                    }
                }
            }
        })

        return track_playlist;
    }

    async removeTrackFromPlaylist(userID: string,playListID: string , trackID: string,):Promise<any> {
        const playlist = await this.prisma.playlist.findOne({
            where : {
                id: playListID
            }
        })

        if(!playlist)
            throw new HttpException({
                code : HttpStatus.NOT_FOUND,
                message : "The Playlist Not Found"
            },HttpStatus.NOT_FOUND)


        if(playlist.userid !== userID) 
            throw new HttpException({
                code : HttpStatus.FORBIDDEN,
                message: "Not Allowed To change Playlist"
            },HttpStatus.FORBIDDEN)
        
        const deleted = await this.prisma.track_playlist.deleteMany({
            where : {
                playlist_id :playListID,
                track_id : trackID
            }
        })

        return {count : deleted.count , deleted : deleted.count === 1}
    }

    async getPlaylistByID(playListID: any) {
        return await this.prisma.playlist.findOne({
            where : {
                id : playListID,
            },
            include : {
                track_playlist :{
                    include : {
                        track : {
                            include:{
                                gerne_gerneTotrack : true,
                                track_artist : {
                                    include : {
                                        artist : true
                                    }
                                },
                                album : true
                            }
                        },
                    }
                }
            }
        })
    }

    async getPlaylistsForUser(userID: any){
        const user = await this.prisma.users.findOne({
            where : {
                id: userID
            },
            include : {
                playlist : true
            }
        })
        if(!user) throw new HttpException({
            code: HttpStatus.NOT_FOUND,
            message : "User Not found !"
        },HttpStatus.NOT_FOUND)

        return user.playlist
    }

    async updatePlaylistName(userID: any,playListID: any , newName: any){
        const playlist = await this.prisma.playlist.findOne({
            where : {
                id: playListID
            }
        })

        if(!playlist)
            throw new HttpException({
                code : HttpStatus.NOT_FOUND,
                message : "The Playlist Not Found"
            },HttpStatus.NOT_FOUND)


        if(playlist.userid !== userID) 
            throw new HttpException({
                code : HttpStatus.FORBIDDEN,
                message: "Not Allowed To change Playlist"
            },HttpStatus.FORBIDDEN)

        const updatedPlaylist = await this.prisma.playlist.update({
            where:{
                id: playlist.id
            },
            data : {
                name : newName
            }
        })
        return updatedPlaylist
    }

    async deletePlaylist(userID: any , playListID: any) {
        const playlist = await this.prisma.playlist.findOne({
            where : {
                id: playListID
            }
        })

        if(!playlist)
            throw new HttpException({
                code : HttpStatus.NOT_FOUND,
                message : "The Playlist Not Found"
            },HttpStatus.NOT_FOUND)


        if(playlist.userid !== userID) 
            throw new HttpException({
                code : HttpStatus.FORBIDDEN,
                message: "Not Allowed To change Playlist"
            },HttpStatus.FORBIDDEN)

        await this.prisma.track_playlist.deleteMany({
            where : {
                playlist:{
                    id: playlist.id
                }
            }
        })

        const deleted = await this.prisma.playlist.delete({
            where : {
                id : playlist.id
            }
        })


        if(!deleted)
            return {
                deleted : false
            }
        else {
            return {
                deleted : true
            }
        }
    }

}