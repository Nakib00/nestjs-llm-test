/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, UnauthorizedException, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './registerUser.dto';
import { LoginUserDto } from './loginUser.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth') // /suth/register
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService) { }

    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto) {

        const token = await this.authService.registerUser(registerUserDto);
        return token;
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
        const token = await this.authService.login(email, password);
        if (!token) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return token;
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const userId = req.user.sub;

        const user = await this.userService.findById(userId);
        return {
            id: user?._id,
            fname: user?.fname,
            lname: user?.lname,
            email: user?.email,
        };
    }
}
