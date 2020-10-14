import { Injectable } from '@nestjs/common';
import {ElasticsearchService} from '@nestjs/elasticsearch'
@Injectable()
export class SearchService {
    constructor(private readonly elasticsearchService: ElasticsearchService) {}
    
    async searchAlbum(text: string,page=1 , limit=2): Promise<any>{
        // search Album with AlbumName
        const past = (page-1)*limit;
        try{
            const result = this.elasticsearchService.search({
                index:'album',
                body: {
                    query : {
                        bool:{
                            should:[
                                {
                                    match: {
                                        album_name: {
                                            query:text
                                        }
                                    }
                                },{
                                    match: {
                                        "artist.artist_name":{
                                            query:text
                                        }
                                    }
                                },
                                {
                                    match:{"track.track_artist.artist.artist_name": {
                                            query: text
                                        }
                                        
                                    }
                                }
                                
                            ]
                        }
                        
                    },
                },
                size: limit,
                from : past
            })
            return result
        }catch(err){console.log(err)}
    }

    async searchArtist(text: string,page=0 , limit=10): Promise<any>{
        const past = (page-1)*limit;
        try{
            const result = this.elasticsearchService.search({
                index:'artist',
                body: {
                    query : {
                        match: {
                            artist_name: {
                                query:text
                            }
                        }
                    },
                },
                size: limit,
                from : past
            })
            return result
        }catch(err){console.log(err)}
    }

    async searchTrackName(text: string,page=1 , limit=10): Promise<any>{
        const past = (page-1)*limit;
        try{
            const result = this.elasticsearchService.search({
                index:'track',
                body: {
                    query : {
                        match: {
                            track_name: {
                                query:text
                            }
                        }
                    },
                },
                size: limit,
                from : past
            })
            return result
        }catch(err){console.log(err)}
    }

}