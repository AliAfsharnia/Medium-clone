import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { User } from 'src/user/decoratores/user.decorator';
import { ProfileResponseInterface } from './type/profileResponse.interface';
import { AuthGuard } from 'src/user/Guards/auth.guard';

@Controller('profiles')
export class ProfileController {
    constructor(private readonly profileService: ProfileService){}

    @Get(':username')
    async getProfile(@User('id') currentUserId, @Param('username') profileUsername):Promise<ProfileResponseInterface>{
        const profile = await this.profileService.getProfile(currentUserId, profileUsername);
        return this.profileService.createProfileResponse(profile);
    }

    @Post(':username/follow')
    @UseGuards(AuthGuard)
    async followUser(@User('id') currentUserId: number, @Param('username') followUsername: string): Promise<ProfileResponseInterface>{
        const profile = await this.profileService.followUser(currentUserId, followUsername);
        return this.profileService.createProfileResponse(profile);
    }

    @Delete(':username/unfollow')
    @UseGuards(AuthGuard)
    async unfollowUser(@User('id') currentUserId: number, @Param('username') followUsername: string): Promise<ProfileResponseInterface>{
        const profile = await this.profileService.unfollowUser(currentUserId, followUsername);
        return this.profileService.createProfileResponse(profile);
    }

}
