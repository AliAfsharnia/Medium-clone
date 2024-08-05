import { Injectable, NestMiddleware } from "@nestjs/common";
import { verify } from "jsonwebtoken";
import { NextFunction  ,Response} from "express";
import { ExpressRequest } from "src/type/expressRequest.interface";
import { JWT_SECRETE } from "src/config";
import { UserService } from "../user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor(private readonly userService: UserService){};
    async use(req: ExpressRequest, res: Response, next: NextFunction){
        if(!req.headers.authorization){
            req.user = null;
            next()
            return;
        }
       
        try{
            const token = req.headers.authorization.split(' ')[1];
            const decode = verify(token ,JWT_SECRETE);
            const user = await this.userService.findById(decode.id);
            req.user = user;
            next()
        }catch(err){
            req.user = null;
            next()
        }
    }
}