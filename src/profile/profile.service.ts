/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
const bcrypt = require('bcrypt');
import { PrismaService } from '../Prisma/prisma.service';
import { users, usersCreateInput, usersWhereUniqueInput } from '@prisma/client';
import { AccountOverViewResponseDTO } from './profile.dto';
import { authService } from 'src/auth/auth.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService,private auth: authService) {}

  async getAccountOverView(userID): Promise<AccountOverViewResponseDTO> {
    const user = await this.prisma.users.findOne({
      where: {
        id: userID as string,
      },
    });
    return this.serialiseUserData(user);
  }

  async updateAccountDetails(userID,updatedDetails: any): Promise<users> {
    let user = await this.prisma.users.findOne({
      where: {
        id: userID as string,
      },
    });

    if(!user) throw new HttpException({
        code : 404,
        error : "USER NOT FOUND"
    },HttpStatus.NOT_FOUND)
    
    user = await this.prisma.users.update({
        where : {
            id: userID as string,
        },
        data : {
            email : updatedDetails.email,
            dob : updatedDetails.dob,
            gender : updatedDetails.gender
        }
    })

    return user;
  }

  async changePassword(userID,oldPassword: string, newPassword: string): Promise<any> {
    const user = await this.prisma.users.findOne({
        where: {
          id: userID as string,
        },
    });
    const verified = await this.auth.verifyUser(user,oldPassword);
    if(verified){
        const newHashedPassword = await this.auth.getHashPassword(newPassword);
        await this.prisma.users.update({
            where : {
                id : user.id,
            },
            data : {
                password : newHashedPassword
            }
        })
        return {
            success : true,
            message : 'password changed !'
        }
    }

    throw new HttpException({
        code : HttpStatus.NOT_ACCEPTABLE,
        error : "password incorrect !"
    },HttpStatus.NOT_ACCEPTABLE)

  }

  async canChangePassword(userID: string) : Promise<boolean>{
    const user = await this.prisma.users.findOne({
        where: {
          id: userID as string,
        },
    });

    if(!user) throw new HttpException({
        code : 404,
        error : "USER NOT FOUND"
    },HttpStatus.NOT_FOUND)

    return user.authtype === 'local'


  }


  serialiseUserData (user: users): AccountOverViewResponseDTO{

    return {
        userName : user.name,
        email : user.email,
        dob : user.dob.toLocaleString().split(',')[0],
        gender : user.gender,
        editable : user.authtype === 'local'
    } 
  }

}
