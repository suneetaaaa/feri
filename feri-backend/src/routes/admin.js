// FERI — Admin Routes
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate, requireRole('ADMIN'));

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  const [users, products, orders, disputes] = await Promise.all([
    prisma.user.count(),
    prisma.product.groupBy({ by: ['status'], _count: true }),
    prisma.order.aggregate({ _sum: { totalAmount: true }, _count: true }),
    prisma.dispute.count({ where: { status: 'OPEN' } })
  ]);
  res.json({ users, products, orders, disputes });
});

// GET /api/admin/products/pending
router.get('/products/pending', async (req, res) => {
  const products = await prisma.product.findMany({
    where: { status: 'PENDING' },
    include: {
      category: true,
      sellerProfile: { select: { shopName: true, isVerified: true } }
    },
    orderBy: { createdAt: 'asc' }
  });
  res.json({ products });
});

// PATCH /api/admin/products/:id/approve
router.patch('/products/:id/approve', async (req, res) => {
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: { status: 'APPROVED' }
  });
  await prisma.adminLog.create({
    data: { adminId: req.user.id, action: 'APPROVE_PRODUCT', targetId: req.params.id, target: 'Product' }
  });
  res.json({ product });
});

// PATCH /api/admin/products/:id/reject
router.patch('/products/:id/reject', async (req, res) => {
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: { status: 'REJECTED' }
  });
  await prisma.adminLog.create({
    data: { adminId: req.user.id, action: 'REJECT_PRODUCT', targetId: req.params.id, target: 'Product', details: req.body }
  });
  res.json({ product });
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({
    include: { sellerProfile: { select: { shopName: true, trustBadge: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ users });
});

// PATCH /api/admin/users/:id/ban
router.patch('/users/:id/ban', async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { isBanned: true, bannedReason: req.body.reason }
  });
  await prisma.adminLog.create({
    data: { adminId: req.user.id, action: 'BAN_USER', targetId: req.params.id, target: 'User' }
  });
  res.json({ user });
});

// GET /api/admin/disputes
router.get('/disputes', async (req, res) => {
  const disputes = await prisma.dispute.findMany({
    include: {
      order: { include: { items: { include: { product: true } } } },
      buyer: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ disputes });
});

// PATCH /api/admin/disputes/:id/resolve
router.patch('/disputes/:id/resolve', async (req, res) => {
  const dispute = await prisma.dispute.update({
    where: { id: req.params.id },
    data: { status: 'RESOLVED', resolution: req.body.resolution }
  });
  res.json({ dispute });
});

module.exports = router;
