import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { HelloModule } from '../src/hello/hello.module';
import { title } from 'process';

describe('HelloController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HelloModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/hello-create (POST)', () => {
    return request(app.getHttpServer())
      .post('/hello-create')
      .expect(201)
      .expect({ title: "postHelloWithEmptyBody respone default created" })
  })

  afterEach(async () => {
    await app.close();
  });
});
