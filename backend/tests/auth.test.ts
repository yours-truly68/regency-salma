import supertest from 'supertest';
import app from '../src/index';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const request = supertest(app);

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Clear users
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  let accessToken: string;
  let refreshToken: string;
  const testEmail = 'test@example.com';
  const testPassword = 'securepassword123';

  it('should register a new user and return tokens', async () => {
    const res = await request.post('/auth/register').send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;

    // Verify hashing
    const user = await prisma.user.findUnique({ where: { email: testEmail } });
    expect(user).toBeDefined();
    const isValid = await bcrypt.compare(testPassword, user!.passwordHash);
    expect(isValid).toBe(true);
  });

  it('should login an existing user', async () => {
    const res = await request.post('/auth/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    
    // Update tokens for next tests
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('should get current user with access token', async () => {
    const res = await request.get('/auth/me').set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(testEmail);
  });

  it('should fail to get user without token', async () => {
    const res = await request.get('/auth/me');
    expect(res.status).toBe(401);
  });

  it('should refresh tokens', async () => {
    const res = await request.post('/auth/refresh').send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');

    // Update tokens for next tests
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('should logout and revoke session', async () => {
    const res = await request.post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken });
      
    expect(res.status).toBe(200);

    // Trying to refresh with the revoked token should fail
    const failRes = await request.post('/auth/refresh').send({ refreshToken });
    expect(failRes.status).toBe(401);
  });
});
