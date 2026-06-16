// FERI — Products Routes
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate, requireSeller } = require('../middleware/auth');

// GET /api/products — list with filter/search/sort
router.get('/', async (req, res) => {
  try {
    const {
      q, category, condition, minPrice, maxPrice,
      sort = 'createdAt', order = 'desc',
      page = 1, limit = 20, featured
    } = req.query;

    const where = {
      status: 'APPROVED',
      ...(q && {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { tags: { has: q } }
        ]
      }),
      ...(category && { category: { slug: category } }),
      ...(condition && { condition }),
      ...((minPrice || maxPrice) && {
        sellingPrice: {
          ...(minPrice && { gte: parseFloat(minPrice) }),
          ...(maxPrice && { lte: parseFloat(maxPrice) })
        }
      }),
      ...(featured === 'true' && { isFeatured: true })
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          sellerProfile: {
            select: {
              id: true, shopName: true, avatarUrl: true,
              trustBadge: true, averageRating: true,
              commitment: { select: { isActive: true } }
            }
          },
          _count: { select: { reviews: true } }
        },
        orderBy: sort === 'price' ? { sellingPrice: order } : { [sort]: order },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      }),
      prisma.product.count({ where })
    ]);

    res.json({ products, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        sellerProfile: {
          include: {
            user: { select: { name: true, createdAt: true } },
            commitment: true,
            trustScore: true,
            _count: { select: { products: true } }
          }
        },
        reviews: {
          include: { author: { select: { name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: { select: { reviews: true, wishlistItems: true } }
      }
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Increment view count
    await prisma.product.update({
      where: { id: req.params.id },
      data: { viewCount: { increment: 1 } }
    });

    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products — seller creates product
router.post('/', authenticate, requireSeller, async (req, res) => {
  try {
    const {
      title, description, condition, originalPrice, sellingPrice,
      defectDisclosure, categoryId, brand, size, color, tags,
      imageUrls, videoUrl, cloudinaryIds
    } = req.body;

    const product = await prisma.product.create({
      data: {
        title, description, condition, defectDisclosure,
        originalPrice: parseFloat(originalPrice),
        sellingPrice: parseFloat(sellingPrice),
        categoryId, brand, size, color,
        tags: tags || [],
        imageUrls: imageUrls || [],
        videoUrl, cloudinaryIds: cloudinaryIds || [],
        sellerProfileId: req.user.sellerProfile.id,
        status: 'PENDING'
      }
    });

    res.status(201).json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id
router.put('/:id', authenticate, requireSeller, async (req, res) => {
  try {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.sellerProfileId !== req.user.sellerProfile.id)
      return res.status(403).json({ error: 'Not authorized' });

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { ...req.body, status: 'PENDING' } // re-review on edit
    });

    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', authenticate, requireSeller, async (req, res) => {
  try {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.sellerProfileId !== req.user.sellerProfile.id)
      return res.status(403).json({ error: 'Not authorized' });

    await prisma.product.update({
      where: { id: req.params.id },
      data: { status: 'ARCHIVED' }
    });

    res.json({ message: 'Product archived' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to archive product' });
  }
});

module.exports = router;
