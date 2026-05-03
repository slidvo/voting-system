# Libs for validating dto (rq body)
1. yarn add class-validator class-transformer
2. user validate pipe in main.ts

# Lib for configs
yarn add @nestjs/config

```typescript
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
```

# Если хочешь изолировать контроллер и замокать сервис — делают так:
```typescript
const module: TestingModule = await Test.createTestingModule({
  controllers: [HelloController],
  providers: [
    {
      provide: HelloService,
      useValue: {
        getHello: jest.fn().mockReturnValue('Hello World!'), // заглушка
      },
    },
  ],
}).compile();
```