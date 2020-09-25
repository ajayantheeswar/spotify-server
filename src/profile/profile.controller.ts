import { Body, Catch, Controller, Get, Patch, Session , Put} from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('/profile')
export class ProfileController {
    constructor(private profile: ProfileService){}

    @Get('/account-overview')
    async getAccountOverview(@Session() session){
        try{
            const userID = session.userID
            const accountOverview =  await this.profile.getAccountOverView(userID);
            return accountOverview
        }
        catch(err){
            throw err
        }
    }

    @Patch('/edit-profile')
    async updateProfile(@Session() session , @Body() updateDetails){
        try{
            const userID = session.userID
            const editedProfile =  await this.profile.updateAccountDetails(userID,updateDetails);
            return {
                success : true,
                name : editedProfile.name,
                email : editedProfile.email,
                gender: editedProfile.gender,
                dob: editedProfile.dob.toLocaleString().split(',')[0],
                editable : editedProfile.authtype === 'local'
            }
        }
        catch(err){
            throw err
        }
    }

    @Get('/check-change-password-privilage')
    async getPasswordChange(@Session() session) : Promise<any> {
        const userID = session.userID;
        const allowed = await this.profile.canChangePassword(userID);
        return {
            success : true,
            allowed
        }
    }

    @Put('/change-password')
    async changePassword(@Body() body: any,@Session() session) : Promise<any> {
        const userID = session.userID
        return this.profile.changePassword(userID,body.oldPassword, body.newPassword)
    }

}