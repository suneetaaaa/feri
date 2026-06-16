// FERI — eSewa Payment Routes
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');
const crypto = require('crypto');

const ESEWA_MERCHANT_ID = process.env.ESEWA_MERCHANT_ID || 'EPAYTEST';
const ESEWA_SECRET = process.env.ESEWA_SECRET || '8gBm/:&EnhH.1/q';

// Generate eSewa HMAC signature
const generateEsewaSignature = (totalAmount, transactionUuid, productCode) => {
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  return crypto.createHmac('sha256', ESEWA_SECRET)
    .update(message)
    .digest('base64');
};

// POST /api/payment/initiate — create eSewa payment payload
router.post('/initiate', authenticate, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.buyerId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    const transactionUuid = `FERI-${Date.now()}-${orderId.slice(0, 8)}`;
    const totalAmount = order.totalAmount;
    const signature = generateEsewaSignature(totalAmount, transactionUuid, ESEWA_MERCHANT_ID);

    // Store transaction UUID on order
    await prisma.order.update({
      where: { id: orderId },
      data: { esewaRefId: transactionUuid }
    });

    res.json({
      esewaPayload: {
        amount: totalAmount,
        tax_amount: 0,
        total_amount: totalAmount,
        transaction_uuid: transactionUuid,
        product_code: ESEWA_MERCHANT_ID,
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: `${process.env.FRONTEND_URL}/payment/success?orderId=${orderId}`,
        failure_url: `${process.env.FRONTEND_URL}/payment/failure?orderId=${orderId}`,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        signature
      },
      esewaUrl: process.env.NODE_ENV === 'production'
        ? 'https://epay.esewa.com.np/api/epay/main/v2/form'
        : 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

// POST /api/payment/verify — verify eSewa callback
router.post('/verify', authenticate, async (req, res) => {
  try {
    const { orderId, status, refId } = req.body;

    // In production: call eSewa verification API
    // For MVP: simulate success
    if (status === 'COMPLETE' || status === 'success') {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'paid',
          status: 'PLACED',
          esewaRefId: refId
        },
        include: { items: { include: { product: true } } }
      });

      // Mark products as sold
      await Promise.all(order.items.map(item =>
        prisma.product.update({
          where: { id: item.productId },
          data: { status: 'SOLD' }
        })
      ));

      // Clear buyer's cart
      await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });

      res.json({ success: true, order });
    } else {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'failed', status: 'CANCELLED' }
      });
      res.json({ success: false, message: 'Payment failed' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// POST /api/payment/simulate — Demo Day: instant success simulation
router.post('/simulate', authenticate, async (req, res) => {
  try {
    const { orderId } = req.body;
    const refId = `SIM-${Date.now()}`;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'paid', status: 'PLACED', esewaRefId: refId },
      include: { items: { include: { product: true } } }
    });

    await Promise.all(order.items.map(item =>
      prisma.product.update({
        where: { id: item.productId },
        data: { status: 'SOLD' }
      })
    ));

    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });

    res.json({ success: true, order, refId });
  } catch (err) {
    res.status(500).json({ error: 'Simulation failed' });
  }
});

module.exports = router;
