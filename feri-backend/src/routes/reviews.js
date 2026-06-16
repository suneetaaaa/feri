// FERI — Reviews Routes
const reviewRouter = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');

reviewRouter.post('/', authenticate, async (req, res) => {
  try {
    const { productId, rating, title, body, accuracyRating, shippingRating } = req.body;
    const review = await prisma.review.create({
      data: {
        productId, authorId: req.user.id,
        rating: parseInt(rating), title, body,
        accuracyRating: accuracyRating ? parseInt(accuracyRating) : null,
        shippingRating: shippingRating ? parseInt(shippingRating) : null,
        isVerified: true
      },
      include: { author: { select: { name: true, avatarUrl: true } } }
    });

    // Recalculate seller average rating
    const product = await prisma.product.findUnique({ where: { id: productId } });
    const reviews = await prisma.review.aggregate({
      where: { product: { sellerProfileId: product.sellerProfileId } },
      _avg: { rating: true }, _count: true
    });
    await prisma.sellerProfile.update({
      where: { id: product.sellerProfileId },
      data: { averageRating: reviews._avg.rating || 0 }
    });

    res.status(201).json({ review });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

reviewRouter.get('/product/:productId', async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { productId: req.params.productId },
    include: { author: { select: { name: true, avatarUrl: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ reviews });
});

module.exports = reviewRouter;
