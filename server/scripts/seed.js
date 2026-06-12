import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { ROLES } from '../config/constants.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Cart } from '../models/Cart.js';
import { Wishlist } from '../models/Wishlist.js';
import { Review } from '../models/Review.js';
import { Order } from '../models/Order.js';
import { Address } from '../models/Address.js';
import { categorySeed } from './data/categories.js';
import { productSeed } from './data/products.js';

const isDestroy = process.argv.includes('--destroy');

async function destroyAll() {
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Cart.deleteMany({}),
    Wishlist.deleteMany({}),
    Review.deleteMany({}),
    Order.deleteMany({}),
    Address.deleteMany({}),
  ]);
  // eslint-disable-next-line no-console
  console.log('🗑️  All collections cleared');
}

function withTimestamps(products) {
  // Spread createdAt across the last ~60 days for realistic "newest" sorting.
  const now = Date.now();
  return products.map((p, i) => ({
    ...p,
    createdAt: new Date(now - i * 2 * 24 * 60 * 60 * 1000),
  }));
}

async function seed() {
  await destroyAll();

  // 1. Categories
  const categories = await Category.insertMany(categorySeed);
  const categoryByName = Object.fromEntries(
    categories.map((c) => [c.name, c._id]),
  );
  // eslint-disable-next-line no-console
  console.log(`📁 Inserted ${categories.length} categories`);

  // 2. Products (resolve category name -> id)
  const productsToInsert = withTimestamps(productSeed).map((p) => ({
    ...p,
    category: categoryByName[p.category],
  }));
  // Use create() so pre-validate hooks (slug) run per document.
  const products = await Product.create(productsToInsert);
  // eslint-disable-next-line no-console
  console.log(`📦 Inserted ${products.length} products`);

  // 3. Admin + demo accounts
  const admin = await User.create({
    firstName: 'Aurora',
    lastName: 'Admin',
    email: env.seed.adminEmail,
    password: env.seed.adminPassword,
    role: ROLES.ADMIN,
    isVerified: true,
  });
  const demo = await User.create({
    firstName: 'Demo',
    lastName: 'Customer',
    email: env.seed.demoEmail,
    password: env.seed.demoPassword,
    role: ROLES.USER,
    isVerified: true,
  });
  // eslint-disable-next-line no-console
  console.log('👤 Created admin + demo accounts');

  // 4. A demo address + a couple of approved reviews for realism
  await Address.create({
    user: demo._id,
    label: 'Home',
    firstName: 'Demo',
    lastName: 'Customer',
    line1: '425 Market Street',
    line2: 'Suite 200',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'United States',
    phone: '+1 415 555 0148',
    isDefault: true,
  });

  await Review.create([
    {
      user: demo._id,
      product: products[0]._id,
      rating: 5,
      title: 'Sings beautifully',
      body: 'The tone opened up after a week of playing. Easily punches above its price.',
      status: 'approved',
    },
    {
      user: demo._id,
      product: products[8]._id,
      rating: 5,
      title: 'Race-day ready',
      body: 'Set a marathon PB in these. The plate really does carry you through the late miles.',
      status: 'approved',
    },
  ]);
  // eslint-disable-next-line no-console
  console.log('⭐ Seeded demo address and reviews');

  // eslint-disable-next-line no-console
  console.log('\n✅ Seed complete');
  console.log(`   Admin: ${env.seed.adminEmail} / ${env.seed.adminPassword}`);
  console.log(`   Demo:  ${env.seed.demoEmail} / ${env.seed.demoPassword}\n`);
}

async function run() {
  await connectDB();
  if (isDestroy) {
    await destroyAll();
  } else {
    await seed();
  }
  await disconnectDB();
  await mongoose.connection.close();
  process.exit(0);
}

run().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error('❌ Seed failed:', err);
  await disconnectDB();
  process.exit(1);
});
