import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { USER_REPOSITORY } from "@src/user/user.constants";
import { DeepPartial } from "typeorm";
import { User } from "@src/user/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { ConflictException } from "@nestjs/common";
import { RegisterBodyRqDto } from "./dto/RegisterBodyRqDto";
import * as bcrypt from "bcrypt";

const DATE_1 = new Date();

const MOCK_USER: User = {
    id: 42,
    name: "Test User",
    email: "mail@mail.ru",
    password: "hashed",
    createdAt: DATE_1,
    permissions: [],
};

const REGISTER_DTO: RegisterBodyRqDto = {
    name: "Test User",
    email: "mail@mail.ru",
    password: "password123",
};

describe("AuthService", () => {
    let service: AuthService;
    let userRepository: { findOneBy: jest.Mock; create: jest.Mock; save: jest.Mock };
    let jwtService: { sign: jest.Mock };

    beforeEach(async () => {
        userRepository = {
            findOneBy: jest.fn().mockResolvedValue(null),
            create: jest.fn((_user: DeepPartial<User>) => MOCK_USER),
            save: jest.fn().mockResolvedValue(MOCK_USER),
        };

        jwtService = {
            sign: jest.fn().mockReturnValue("mock.jwt.token"),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: USER_REPOSITORY, useValue: userRepository },
                { provide: JwtService, useValue: jwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe("register", () => {
        it("should return access token on successful registration", async () => {
            const result = await service.register(REGISTER_DTO);

            expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: REGISTER_DTO.email });
            const createArg = userRepository.create.mock.calls[0][0];
            expect(createArg.name).toBe(REGISTER_DTO.name);
            expect(createArg.email).toBe(REGISTER_DTO.email);
            expect(createArg.password).not.toBe(REGISTER_DTO.password);
            expect(await bcrypt.compare(REGISTER_DTO.password, createArg.password)).toBe(true);
            expect(userRepository.save).toHaveBeenCalledWith(MOCK_USER);
            expect(jwtService.sign).toHaveBeenCalledWith({ sub: MOCK_USER.id, email: MOCK_USER.email });
            expect(result).toEqual({ access_token: "mock.jwt.token" });
        });

        it("should throw ConflictException when email is already taken", async () => {
            userRepository.findOneBy.mockResolvedValue(MOCK_USER);

            await expect(service.register(REGISTER_DTO)).rejects.toThrow(ConflictException);
            expect(userRepository.create).not.toHaveBeenCalled();
            expect(userRepository.save).not.toHaveBeenCalled();
        });
    });
})