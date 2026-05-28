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
    private readonly logger = new Logger(AuthService.name);

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

        try {
            const hashedPassword = await bcrypt.hash(dto.password, 10);
            const user = this.userRepository.create({
                name: dto.name,
                email: dto.email,
                password: hashedPassword,
            });
            await this.userRepository.save(user);
            return this.generateToken(user);
        } catch (error) {
            this.logger.error(`Failed to register user with email ${dto.email}`, error instanceof Error ? error.stack : String(error));
            throw error;
        }
    }

    async login(dto: LoginDto): Promise<AccessTokenDto> {
        let user: User | null;
        try {
            user = await this.userRepository.findOneBy({ email: dto.email });
        } catch (error) {
            this.logger.error(`DB error while looking up user by email ${dto.email}`, error instanceof Error ? error.stack : String(error));
            throw error;
        }

        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateToken(user);
    }

    private generateToken(user: User): AccessTokenDto {
        const payload = { sub: user.id, email: user.email, permissions: user.permissions };
        return { access_token: this.jwtService.sign(payload) };
    }
}
