/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './registerUser.dto';
import { Role } from 'src/user/user.type';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

    async registerUser(registerUserDto: RegisterUserDto) {

        console.log(registerUserDto);

        const saltRounds = 10;
        const hash = await bcrypt.hash(registerUserDto.password, saltRounds);

        // Ensure role defaults to student when not provided in registration
        const userPayload: RegisterUserDto & { role?: Role } = {
            ...registerUserDto,
            password: hash,
            role: registerUserDto.role ?? Role.student,
        };
        const user = this.userService.createUser(userPayload as RegisterUserDto);

        const payload = { sub:  (await user)._id};
        const token = await this.jwtService.signAsync(payload)

        return {accessToken:token};
    }

    async validateUser(email: string, password: string): Promise<Omit<UserDocument, 'password'> | null> {
        const user = await this.userService.findByEmail(email);
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        // return user object without password
        const objRaw = user.toObject ? user.toObject() : { ...(user as Partial<UserDocument>) };
        type ObjType = { [k: string]: unknown } & Partial<UserDocument>;
        const obj = objRaw as ObjType;
        // extract password to omit it from the returned object
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _pw, ...rest } = obj;
        return rest as Omit<UserDocument, 'password'>;
    }

    async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            return null;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        const payload = { sub: user._id,role:user.role };
        const token = await this.jwtService.signAsync(payload);
        return { accessToken: token };
    }
}
