// FERI — Users Routes
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');

router.put('/me', authenticate, async (req, res) => {
  const { name, phone, avatarUrl } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, phone, avatarUrl },
    select: { id: true, name: true, email: true, phone: true, avatarUrl: true, role: true }
  });
  res.json({ user });
});

module.exports = router;
