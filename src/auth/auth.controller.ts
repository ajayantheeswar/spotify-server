import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Session } from '@nestjs/common';
import {EmailSignUpDTO, EmailSignUpResponseDTO , EmailSignInDTO} from './auth.dto';
import { authService } from './auth.service';


@Controller('/auth')
export class authController {
    constructor(private AuthService : authService) {} 

    @Post('/sign-up-with-email') 
    async emailSignUp (@Body() credentials : EmailSignUpDTO , @Session() session : any) : Promise<EmailSignUpResponseDTO> {

        try{
            const hashedPassword = await this.AuthService.getHashPassword(credentials.password);
            credentials.password = hashedPassword;
            const user = await this.AuthService.createUser(credentials)
           
            session.userID = user.id;
            session.isAuth = true;
            session.role = 'user';
            console.log(session, '/auth');
            return {
                message : 'success',
                name : user.name as string,
                email : user.email as string,
                role : 'user',
                success : true
            }

        }catch(err){
            console.log(err.message)
            throw new HttpException({
                status :  409,
                error : 'The Email Already Exists'
            },409)
        }
    }

    @Post('/sign-in-with-email')
    async emailSignIn (@Body() credentials : EmailSignInDTO , @Session() session : any) : Promise<EmailSignUpResponseDTO> {
        try{
            const user = await this.AuthService.getUserByEmail(credentials.email);
            if(!user) {
                throw new HttpException({
                    code : HttpStatus.UNAUTHORIZED,
                    error: "User Credientials Does not Match"
                },HttpStatus.UNAUTHORIZED)
            }

            const verfied = await this.AuthService.verifyUser(user,credentials.password)
            if(!verfied){
                throw new HttpException({
                    code : HttpStatus.UNAUTHORIZED,
                    error: "User Credientials Does not Match"
                },HttpStatus.UNAUTHORIZED)
            }
            
            session.userID = user.id;
            session.isAuth = true
            session.role = 'user'

            return {
                message : 'success',
                name : user.name as string,
                email : user.email as string,
                role : 'user',
                success : true
            }

        }catch(err){
            throw err
        }
    }

    @Get('/check-auth-status')
    async checkAuthStatus(@Session() session: any): Promise<any>{
        const valid : boolean = session.isAuth && !!session.userID ;

        if(!valid) 
            return {
                success : true,
                isAuth : false
            }
        else {
            const user = await this.AuthService.getUserByID(session.userID)
            if(!user)
                return {
                    success : true,
                    isAuth : false
                }
            else{
                return {
                    message : 'success',
                    name : user.name as string,
                    email : user.email as string,
                    role : 'user',
                    success : true,
                    isAuth : true
                }
            }
        }
    }

    @Post('/signout')
    signOut(@Session() session: any, @Req() req): any{

        session.userID = null;
        session.isAuth = false;
        session.role = null;

        if (session) {
            session.destroy((function(err) {
                if(err) {
                    throw new HttpException({
                        code : HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Error in Destroying session'
                    },HttpStatus.INTERNAL_SERVER_ERROR)
                } else {
                    req.session = null;
                    return {
                        success : true
                    }
                }
            }));
        }else{
            return {session : 'not available'}
        }  
    }
}