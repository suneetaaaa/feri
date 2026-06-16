// FERI — Wishlist Routes
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  const items = await prisma.wishlistItem.findMany({
    where: { userId: req.user.id },
    include: {
      product: {
        include: {
          category: true,
          sellerProfile: { select: { shopName: true, trustBadge: true, averageRating: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ items });
});

router.post('/', authenticate, async (req, res) => {
  const { productId } = req.body;
  const item = await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: req.user.id, productId } },
    update: {},
    create: { userId: req.user.id, productId }
  });
  await prisma.product.update({ where: { id: productId }, data: { wishlistCount: { increment: 1 } } });
  res.json({ item });
});

router.delete('/:productId', authenticate, async (req, res) => {
  await prisma.wishlistItem.deleteMany({
    where: { userId: req.user.id, productId: req.params.productId }
  });
  res.json({ message: 'Removed from wishlist' });
});

module.exports = router;
