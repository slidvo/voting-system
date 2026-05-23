import { ConflictException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@src/user/entities/user.entity';
import { USER_REPOSITORY } from '@src/user/user.constants';
import { RegisterBodyRqDto } from './dto/RegisterBodyRqDto';
import { LoginDto } from './dto/LoginDto';
import { AccessTokenDto } from './dto/AccessTokenDto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterBodyRqDto): Promise<AccessTokenDto> {
        const existing = await this.userRepository.findOneBy({ email: dto.email });
        if (existing) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = this.userRepository.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
        });
        await this.userRepository.save(user);

        return this.generateToken(user);
    }

    async login(dto: LoginDto): Promise<AccessTokenDto> {
        const user = await this.userRepository.findOneBy({ email: dto.email });

        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateToken(user);
    }

    private generateToken(user: User): AccessTokenDto {
        Logger.debug(`User data from DB: ${JSON.stringify(user)}`)
        const payload = { sub: user.id, email: user.email, permissions: user.permissions };
        Logger.debug(`jwt payload: ${JSON.stringify(payload)}`)
        return { access_token: this.jwtService.sign(payload) };
    }
}
