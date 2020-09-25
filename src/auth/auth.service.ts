import { Injectable } from '@nestjs/common';
const bcrypt = require('bcrypt');

import { PrismaService } from '../Prisma/prisma.service';
import { users ,usersCreateInput,usersWhereUniqueInput} from '@prisma/client';
import { EmailSignUpDTO } from './auth.dto';
import { connected } from 'process';

@Injectable()
export class authService {
  constructor(private prisma: PrismaService) {}

  async getUserByEmail(email: string): Promise<users> | undefined {
    const user = await this.prisma.users.findOne({
      where: {
        email: email,
      } as usersWhereUniqueInput,
    });
    return user;
  }

  async getUserByID(ID: string): Promise<users> | undefined {
    const user = await this.prisma.users.findOne({
      where: {
        id: ID,
      } as usersWhereUniqueInput,
    });
    return user;
  }

  async createUser(userData : EmailSignUpDTO){
    const user = {
        ...userData,
        authtype: 'local'
    }

    const newUser = await this.prisma.users.create({
          data : user as usersCreateInput
    })
    return newUser;
  }

  async isUserExists(email :string) : Promise<boolean> {
    const user = await this.getUserByEmail(email);
    return !!user;
  }

  async getHashPassword(password : string) :Promise<string> {
    const hashedPassword = await bcrypt.hash(password,10)
    return hashedPassword
  }

  async verifyUser(user :users , attemptPassword : string) : Promise<boolean> {
    return await bcrypt.compare(attemptPassword,user.password)
  }

}
