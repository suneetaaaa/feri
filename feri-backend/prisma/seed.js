// FERI — Seed Data for Demo Day
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const COMMITMENT_TEXT = `As a FERI Seller, I solemnly commit to:

1. Upload genuine, unfiltered photos that accurately represent my items.
2. Describe every product honestly — including flaws, wear, and defects.
3. Disclose all known defects before a buyer commits to purchase.
4. Ship within the agreed timeframe after payment confirmation.
5. Communicate respectfully and promptly with every buyer.
6. Never misrepresent item condition, size, brand, or origin.
7. Honour every sale and not cancel without valid reason.`;

async function main() {
  console.log('🌱 Seeding FERI database...');

  // Categories
  const clothesCategory = await prisma.category.upsert({
    where: { slug: 'clothes' },
    update: {},
    create: { name: 'Clothes', slug: 'clothes', description: 'Pre-loved fashion', imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400' }
  });
  const novelsCategory = await prisma.category.upsert({
    where: { slug: 'novels' },
    update: {},
    create: { name: 'Novels', slug: 'novels', description: 'Second-hand books', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' }
  });

  // Admin user
  await prisma.user.upsert({
    where: { email: 'admin@feri.com.np' },
    update: {},
    create: {
      name: 'FERI Admin',
      email: 'admin@feri.com.np',
      passwordHash: await bcrypt.hash('Admin@1234', 12),
      role: 'ADMIN'
    }
  });

  // Seller 1 — Priya
  const priya = await prisma.user.upsert({
    where: { email: 'priya@example.com' },
    update: {},
    create: {
      name: 'Priya Shrestha',
      email: 'priya@example.com',
      passwordHash: await bcrypt.hash('Test@1234', 12),
      role: 'SELLER',
      phone: '9841000001',
      sellerProfile: {
        create: {
          shopName: "Priya's Closet",
          bio: 'Curating quality pre-loved fashion from Kathmandu. Every piece tells a story.',
          location: 'Patan, Lalitpur',
          isVerified: true,
          trustBadge: 'TOP_SELLER',
          totalSales: 47,
          averageRating: 4.8,
          commitment: { create: { pledgeText: COMMITMENT_TEXT, agreedToTerms: true, signedAt: new Date() } },
          trustScore: { create: { score: 4.8, accuracyScore: 4.9, shippingScore: 4.7, communicationScore: 4.8, totalReviews: 47 } }
        }
      }
    },
    include: { sellerProfile: true }
  });

  // Seller 2 — Rohan
  const rohan = await prisma.user.upsert({
    where: { email: 'rohan@example.com' },
    update: {},
    create: {
      name: 'Rohan Tamang',
      email: 'rohan@example.com',
      passwordHash: await bcrypt.hash('Test@1234', 12),
      role: 'SELLER',
      phone: '9841000002',
      sellerProfile: {
        create: {
          shopName: 'Rohan Book Corner',
          bio: 'Books deserve second lives. Selling my well-loved novel collection.',
          location: 'Thamel, Kathmandu',
          isVerified: true,
          trustBadge: 'TRUSTED_SELLER',
          totalSales: 23,
          averageRating: 4.6,
          commitment: { create: { pledgeText: COMMITMENT_TEXT, agreedToTerms: true, signedAt: new Date() } },
          trustScore: { create: { score: 4.6, accuracyScore: 4.7, shippingScore: 4.5, communicationScore: 4.6, totalReviews: 23 } }
        }
      }
    },
    include: { sellerProfile: true }
  });

  // Buyer
  await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: {
      name: 'Maya Gurung',
      email: 'buyer@example.com',
      passwordHash: await bcrypt.hash('Test@1234', 12),
      role: 'BUYER',
      buyerProfile: { create: { address: 'Baneshwor', city: 'Kathmandu', postalCode: '44600' } }
    }
  });

  const priyaProfile = await prisma.sellerProfile.findFirst({ where: { userId: priya.id } });
  const rohanProfile = await prisma.sellerProfile.findFirst({ where: { userId: rohan.id } });

  // Products — Clothes
  const clothesProducts = [
    {
      title: 'Zara Floral Midi Dress',
      description: 'Gorgeous floral midi dress from Zara, worn only twice for special occasions. The fabric is lightweight and perfect for Nepal\'s warmer months.',
      condition: 'LIKE_NEW',
      originalPrice: 8500,
      sellingPrice: 3200,
      defectDisclosure: 'No defects. Minor crease from storage, easily ironed out.',
      brand: 'Zara',
      size: 'S',
      color: 'Floral Blue',
      tags: ['dress', 'floral', 'zara', 'midi', 'women'],
      imageUrls: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800'
      ]
    },
    {
      title: 'H&M Oversized Denim Jacket',
      description: 'Classic oversized denim jacket. Pairs with everything. Great for Kathmandu evenings.',
      condition: 'EXCELLENT',
      originalPrice: 6200,
      sellingPrice: 2400,
      defectDisclosure: 'Minor fading on left sleeve, visible only in direct light. Shown in photos.',
      brand: 'H&M',
      size: 'M',
      color: 'Medium Wash Blue',
      tags: ['jacket', 'denim', 'unisex', 'oversized'],
      imageUrls: [
        'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800',
        'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800'
      ]
    },
    {
      title: 'Levi\'s 501 Jeans — W28 L30',
      description: 'Authentic Levi\'s 501 straight jeans. Timeless style that never goes out of fashion. Worn a handful of times.',
      condition: 'GOOD',
      originalPrice: 9500,
      sellingPrice: 3800,
      defectDisclosure: 'Small scratch on back right pocket button. Does not affect wear.',
      brand: "Levi's",
      size: 'W28 L30',
      color: 'Dark Indigo',
      tags: ['jeans', 'levis', 'denim', 'straight'],
      imageUrls: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
        'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800'
      ]
    }
  ];

  for (const p of clothesProducts) {
    await prisma.product.create({
      data: { ...p, categoryId: clothesCategory.id, sellerProfileId: priyaProfile.id, status: 'APPROVED', isFeatured: true }
    });
  }

  // Products — Novels
  const novelProducts = [
    {
      title: 'The Alchemist — Paulo Coelho',
      description: 'Classic philosophical novel about following your dreams. Paperback, English edition. Life-changing read.',
      condition: 'EXCELLENT',
      originalPrice: 850,
      sellingPrice: 320,
      defectDisclosure: 'Minor yellowing on page edges. A few pencil underlines on first 10 pages.',
      brand: 'HarperCollins',
      tags: ['novel', 'coelho', 'philosophy', 'fiction'],
      imageUrls: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800'
      ]
    },
    {
      title: 'Atomic Habits — James Clear',
      description: 'The bestselling guide to building good habits. Barely used — read once, learnt a lot.',
      condition: 'LIKE_NEW',
      originalPrice: 1200,
      sellingPrice: 550,
      defectDisclosure: 'No defects. Spine intact. No markings.',
      brand: 'Penguin',
      tags: ['habits', 'self-help', 'non-fiction', 'productivity'],
      imageUrls: [
        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800'
      ]
    },
    {
      title: 'Sapiens — Yuval Noah Harari',
      description: 'A Brief History of Humankind. Mind-expanding book. Paperback English edition.',
      condition: 'GOOD',
      originalPrice: 1100,
      sellingPrice: 420,
      defectDisclosure: 'Cover has slight wear at corners. A few pages have light pencil annotations, easily erased.',
      brand: 'Vintage Books',
      tags: ['history', 'harari', 'non-fiction', 'science'],
      imageUrls: [
        'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=800',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800'
      ]
    }
  ];

  for (const p of novelProducts) {
    await prisma.product.create({
      data: { ...p, categoryId: novelsCategory.id, sellerProfileId: rohanProfile.id, status: 'APPROVED', isFeatured: true }
    });
  }

  console.log('✅ FERI database seeded successfully!');
  console.log('\n📧 Demo accounts:');
  console.log('   Admin:  admin@feri.com.np / Admin@1234');
  console.log('   Seller: priya@example.com / Test@1234');
  console.log('   Seller: rohan@example.com / Test@1234');
  console.log('   Buyer:  buyer@example.com / Test@1234');
}

main().catch(console.error).finally(() => prisma.$disconnect());
