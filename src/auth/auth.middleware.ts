import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class userAuthMiddleware implements NestMiddleware {
    
    use(req, res, next){
        if(req.session.userID && req.session.isAuth){
            return next()
        }
        throw new HttpException ({
            code : HttpStatus.UNAUTHORIZED,
            error : "UnAuthorised Access"
        },HttpStatus.UNAUTHORIZED)
        
    };
}
