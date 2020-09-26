import { Injectable } from '@nestjs/common';
import {PrismaService} from '../Prisma/prisma.service';


@Injectable()
export class AlbumService {
    constructor(public prisma: PrismaService) {}
    
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

}