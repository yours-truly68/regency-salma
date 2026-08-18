import { Router } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

router.post('/register', async (req, res, _next) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: { message: 'User already exists' } });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash },
    });

    const { accessToken, refreshToken } = generateTokens(user.id);
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: hashedRefresh,
        expiresAt,
      },
    });

    res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    _next(error);
  }
});

router.post('/login', async (req, res, _next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: hashedRefresh,
        expiresAt,
      },
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    _next(error);
  }
});

router.post('/refresh', async (req, res, _next) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);

    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) {
      return res.status(401).json({ error: { message: 'User not found' } });
    }

    // Find session
    const sessions = await prisma.session.findMany({ where: { userId: user.id } });
    let validSession = null;

    for (const session of sessions) {
      if (await bcrypt.compare(refreshToken, session.refreshToken)) {
        validSession = session;
        break;
      }
    }

    if (!validSession || validSession.expiresAt < new Date()) {
      return res.status(401).json({ error: { message: 'Invalid or expired refresh token' } });
    }

    // Rotate token
    const newTokens = generateTokens(user.id);
    const newHashedRefresh = await bcrypt.hash(newTokens.refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.update({
      where: { id: validSession.id },
      data: { refreshToken: newHashedRefresh, expiresAt },
    });

    res.json(newTokens);
  } catch (_error) {
    res.status(401).json({ error: { message: 'Invalid refresh token' } });
  }
});

router.post('/logout', requireAuth, async (req: AuthRequest, res, _next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: { message: 'Refresh token required for full logout' } });
    }

    const sessions = await prisma.session.findMany({ where: { userId: req.user!.userId } });
    let targetSessionId = null;

    for (const session of sessions) {
      if (await bcrypt.compare(refreshToken, session.refreshToken)) {
        targetSessionId = session.id;
        break;
      }
    }

    if (targetSessionId) {
      await prisma.session.delete({ where: { id: targetSessionId } });
    }

    res.json({ success: true });
  } catch (error) {
    _next(error);
  }
});

router.get('/me', requireAuth, async (req: AuthRequest, res, _next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, email: true, createdAt: true, memberships: { include: { community: true } } },
    });

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json(user);
  } catch (error) {
    _next(error);
  }
});

export default router;
