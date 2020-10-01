import { Body, Controller, Get, NotFoundException, Param, Query, Session, UnauthorizedException } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { authService } from 'src/auth/auth.service';
import { AlbumService } from './album.service';
import { PlayerService } from './player.service';

@Controller('/player')
export class PlayerController {
    constructor(public album: AlbumService,public player: PlayerService,public auth: authService){}

    @Get('/get-album-by-id/:albumID')
    getAlbumByID(@Param('albumID') albumID) {
        return this.album.getAlbumByID(albumID);
    }

    @Get('/get-album-by-language/:languageID')
    getAlbumsByLanguageID(@Param('languageID') languageID, @Query('limit') limit, @Query('skip') skip){
        return this.album.getAlbumByLanguage(languageID,limit,skip)
    }

    @Get('/get-songs-by-artistID/:artistID')
    getSongsByArtistID(@Param('artistID') artistID,  @Query('limit') limit, @Query('skip') skip){
        return this.album.getSongsByArtist(artistID)
    }

    @Get('/get-languages')
    getAllLanguages(){
        return this.album.getAllLanguages()
    }

    @Get('/get-user-playlist')
    getUserPlaylist(@Session() sess){
        if(!(sess.userID && sess.isAuth)) throw new UnauthorizedException({
            message : 'user not authenticated'
        })
        return this.player.getPlaylistsForUser(sess.userID)
    }

    @Post('/create-playlist')
    async createPlaylist (@Session() sess,@Body('name') name: string) {
        if(!(sess.userID && sess.isAuth)) throw new UnauthorizedException({
            message : 'user not authenticated'
        })
        
        const playlist = await this.player.createPlaylist(sess.userID,name)

        return {
            success : true,
            ...playlist
        }
    }

    @Post('/add-track-to-playlist')
    async addTrackToPlaylist (@Session() sess,@Body('playlistID') playlistID: string,@Body('trackID') trackID: string) {
        if(!(sess.userID && sess.isAuth)) throw new UnauthorizedException({
            message : 'user not authenticated'
        })

        const record = await this.player.addTrackToPlaylist(sess.userID,playlistID,trackID)
        return {
            sucess : true,
            playlist : record
        }
    }

    @Get('/get-playListByID/:playlistID')
    async getPlayListByID(@Session() sess,@Param('playlistID') playlistID: string){

        const playlist = await this.player.getPlaylistByID(playlistID)
        if(!playlist) throw new NotFoundException({
            error : 'playlist not Found'
        })
        let owner = false ;
        if(sess.userID) owner = playlistID === playlist.id

        const updatedPlaylist = {
            id : playlist.id,
            name : playlist.name,
            track : null as unknown as any
        }

        const updatedTracks = playlist.track_playlist.map(track => {
            const album = track.track.album
            delete album.id
            delete track.track.album
            return {
                ...track.track,
                ...album
            }
        })

        updatedPlaylist.track = updatedTracks
            
        return {
            updatedPlaylist,
            owner
        }
    }

    @Post('/remove-track-from-playlist')
    async removeTrackFromPlaylist (@Session() sess,@Body('playlistID') playlistID: string,@Body('trackID') trackID: string) {
        if(!(sess.userID && sess.isAuth)) throw new UnauthorizedException({
            message : 'user not authenticated'
        })

        const record = await this.player.removeTrackFromPlaylist(sess.userID,playlistID,trackID)
        return {
            success : true,
            playlist : record
        }
    }

    @Post('/delete-playlist')
    async deletePlaylist (@Session() sess,@Body('playlistID') playlistID: string) {
        if(!(sess.userID && sess.isAuth)) throw new UnauthorizedException({
            message : 'user not authenticated'
        })

        const deleted = await this.player.deletePlaylist(sess.userID,playlistID)
        
        return deleted;
    }

}