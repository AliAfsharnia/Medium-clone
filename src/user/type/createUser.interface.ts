import { UserType } from "./user.type";

export interface UserResponsIntereface{
    user: UserType & {token: string}
}