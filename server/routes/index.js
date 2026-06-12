import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import categoryRoutes from './category.routes.js';

const router = Router();

router.get('/health', (_req, res) =>
  res.json({ success: true, message: 'Aurora API is healthy', uptime: process.uptime() }),
);

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

// Placeholders for milestones still in progress — keep the surface honest.
// /cart /wishlist /orders /reviews /users /admin mount here in the next pass.

export default router;
