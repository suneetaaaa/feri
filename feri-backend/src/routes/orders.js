// FERI — Orders Routes
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// POST /api/orders
router.post('/', authenticate, async (req, res) => {
  try {
    const { items, shippingAddress, shippingCity, paymentMethod = 'esewa' } = req.body;

    if (!items?.length) return res.status(400).json({ error: 'No items in order' });

    const products = await prisma.product.findMany({
      where: { id: { in: items.map(i => i.productId) }, status: 'APPROVED' }
    });

    let total = 0;
    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      total += product.sellingPrice;
      return {
        productId: product.id,
        sellerProfileId: product.sellerProfileId,
        price: product.sellingPrice,
        quantity: 1
      };
    });

    const order = await prisma.order.create({
      data: {
        buyerId: req.user.id,
        totalAmount: total,
        shippingAddress,
        shippingCity,
        paymentMethod,
        trackingCode: `FERI-${uuidv4().slice(0, 8).toUpperCase()}`,
        items: { create: orderItems }
      },
      include: { items: { include: { product: true } } }
    });

    res.status(201).json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to create order' });
  }
});

// GET /api/orders — buyer order history
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { buyerId: req.user.id },
      include: {
        items: {
          include: {
            product: { select: { title: true, imageUrls: true } },
            sellerProfile: { select: { shopName: true } }
          }
        }
      },
      orderBy: { placedAt: 'desc' }
    });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        buyer: { select: { name: true, email: true } },
        items: {
          include: {
            product: true,
            sellerProfile: { include: { commitment: true } }
          }
        },
        disputes: true
      }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.buyerId !== req.user.id && req.user.role !== 'ADMIN')
      return res.status(403).json({ error: 'Unauthorized' });

    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// PATCH /api/orders/:id/status — seller or admin updates status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
