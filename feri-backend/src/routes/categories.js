// FERI — Categories Routes
const catRouter = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

catRouter.get('/', async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: { where: { status: 'APPROVED' } } } } }
  });
  res.json({ categories });
});

module.exports = catRouter;
