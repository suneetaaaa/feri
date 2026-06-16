// FERI — Cart Routes
const cartRouter = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');

cartRouter.get('/', authenticate, async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: { product: { include: { sellerProfile: { select: { shopName: true, trustBadge: true } } } } }
  });
  res.json({ items });
});

cartRouter.post('/', authenticate, async (req, res) => {
  const { productId } = req.body;
  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId: req.user.id, productId } },
    update: {},
    create: { userId: req.user.id, productId }
  });
  res.json({ item });
});

cartRouter.delete('/:productId', authenticate, async (req, res) => {
  await prisma.cartItem.deleteMany({
    where: { userId: req.user.id, productId: req.params.productId }
  });
  res.json({ message: 'Removed' });
});

cartRouter.delete('/', authenticate, async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
  res.json({ message: 'Cart cleared' });
});

module.exports = cartRouter;
