// FERI — Sellers Routes
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/sellers — top sellers
router.get('/', async (req, res) => {
  try {
    const sellers = await prisma.sellerProfile.findMany({
      where: { isVerified: true },
      include: {
        user: { select: { name: true } },
        commitment: { select: { isActive: true } },
        trustScore: true,
        _count: { select: { products: true } }
      },
      orderBy: { averageRating: 'desc' },
      take: parseInt(req.query.limit || 10)
    });
    res.json({ sellers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sellers' });
  }
});

// GET /api/sellers/:id — public seller profile
router.get('/:id', async (req, res) => {
  try {
    const seller = await prisma.sellerProfile.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { name: true, createdAt: true } },
        commitment: true,
        trustScore: true,
        products: {
          where: { status: 'APPROVED' },
          include: { category: true, _count: { select: { reviews: true } } },
          orderBy: { createdAt: 'desc' }
        },
        _count: { select: { products: true } }
      }
    });

    if (!seller) return res.status(404).json({ error: 'Seller not found' });
    res.json({ seller });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch seller' });
  }
});

// POST /api/sellers/onboard — become a seller
router.post('/onboard', authenticate, async (req, res) => {
  try {
    const { shopName, bio, location } = req.body;

    if (req.user.sellerProfile)
      return res.status(409).json({ error: 'Already a seller' });

    const profile = await prisma.sellerProfile.create({
      data: {
        userId: req.user.id,
        shopName, bio, location
      }
    });

    await prisma.user.update({
      where: { id: req.user.id },
      data: { role: 'SELLER' }
    });

    res.status(201).json({ profile });
  } catch (err) {
    res.status(500).json({ error: 'Onboarding failed' });
  }
});

// POST /api/sellers/commitment — sign commitment pledge
router.post('/commitment', authenticate, async (req, res) => {
  try {
    const { agreedToTerms } = req.body;

    if (!req.user.sellerProfile)
      return res.status(400).json({ error: 'Create seller profile first' });

    const commitment = await prisma.commitment.upsert({
      where: { sellerProfileId: req.user.sellerProfile.id },
      update: { agreedToTerms, signedAt: new Date(), isActive: true },
      create: {
        sellerProfileId: req.user.sellerProfile.id,
        pledgeText: COMMITMENT_PLEDGE_TEXT,
        agreedToTerms,
        signedAt: new Date()
      }
    });

    res.json({ commitment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save commitment' });
  }
});

// GET /api/sellers/me/dashboard
router.get('/me/dashboard', authenticate, requireRole('SELLER'), async (req, res) => {
  try {
    const sellerId = req.user.sellerProfile.id;

    const [products, orders, stats] = await Promise.all([
      prisma.product.findMany({
        where: { sellerProfileId: sellerId },
        include: { category: true, _count: { select: { reviews: true, orderItems: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.orderItem.findMany({
        where: { sellerProfileId: sellerId },
        include: {
          order: { include: { buyer: { select: { name: true } } } },
          product: { select: { title: true, imageUrls: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      prisma.sellerProfile.findUnique({
        where: { id: sellerId },
        include: { trustScore: true, commitment: true }
      })
    ]);

    const revenue = orders.reduce((sum, item) => sum + item.price, 0);

    res.json({ products, orders, profile: stats, revenue });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

// PUT /api/sellers/me/profile
router.put('/me/profile', authenticate, requireRole('SELLER'), async (req, res) => {
  try {
    const { shopName, bio, location, avatarUrl, coverImageUrl } = req.body;
    const profile = await prisma.sellerProfile.update({
      where: { id: req.user.sellerProfile.id },
      data: { shopName, bio, location, avatarUrl, coverImageUrl }
    });
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

const COMMITMENT_PLEDGE_TEXT = `As a FERI Seller, I solemnly commit to:

1. Upload genuine, unfiltered photos that accurately represent my items.
2. Describe every product honestly — including flaws, wear, and defects.
3. Disclose all known defects before a buyer commits to purchase.
4. Ship within the agreed timeframe after payment confirmation.
5. Communicate respectfully and promptly with every buyer.
6. Never misrepresent item condition, size, brand, or origin.
7. Honour every sale and not cancel without valid reason.

I understand that violating this pledge may result in removal from FERI and loss of my Trusted Seller status.`;

module.exports = router;
