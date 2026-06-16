// FERI — Auth Middleware
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { sellerProfile: true, buyerProfile: true }
    });

    if (!user || user.isBanned) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

const requireSeller = async (req, res, next) => {
  if (!req.user.sellerProfile) {
    return res.status(403).json({ error: 'Seller profile required' });
  }
  if (!req.user.sellerProfile.commitment) {
    // re-fetch with commitment
    const profile = await prisma.sellerProfile.findUnique({
      where: { id: req.user.sellerProfile.id },
      include: { commitment: true }
    });
    if (!profile?.commitment?.agreedToTerms) {
      return res.status(403).json({ error: 'Commitment pledge required before listing' });
    }
  }
  next();
};

module.exports = { authenticate, requireRole, requireSeller };
