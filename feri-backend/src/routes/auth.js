// FERI — Auth Routes
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'BUYER', phone } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password required' });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name, email, passwordHash, phone,
        role: role === 'SELLER' ? 'SELLER' : 'BUYER',
        buyerProfile: role !== 'SELLER' ? { create: {} } : undefined,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    res.status(201).json({ user, token: generateToken(user.id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        sellerProfile: { include: { commitment: true, trustScore: true } },
        buyerProfile: true
      }
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return res.status(401).json({ error: 'Invalid email or password' });

    if (user.isBanned)
      return res.status(403).json({ error: 'Account suspended. Contact support.' });

    const { passwordHash, ...safeUser } = user;
    res.json({ user: safeUser, token: generateToken(user.id) });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').authenticate, async (req, res) => {
  const { passwordHash, ...user } = req.user;
  res.json({ user });
});

module.exports = router;
