import { Request } from "express";
import { UserEntity } from "src/user/user.entity";
export interface ExpressRequest extends Request{
    req: Promise<UserEntity>;
    user? :UserEntity;
}