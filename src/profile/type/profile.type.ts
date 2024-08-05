import { UserType } from "src/user/type/user.type";

export type ProfileType = UserType & { following: boolean}