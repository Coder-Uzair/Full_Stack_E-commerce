import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  createProductSchema,
  updateProductSchema,
  listProductsQuerySchema,
} from '../validators/product.validator.js';

const router = Router();

router.get('/', validate(listProductsQuerySchema, 'query'), productController.listProducts);
router.get('/search', productController.searchProducts);
router.get('/featured', productController.featuredProducts);
router.get('/:id', productController.getProduct);

router.post(
  '/',
  requireAuth,
  requireAdmin,
  validate(createProductSchema),
  productController.createProduct,
);
router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  validate(updateProductSchema),
  productController.updateProduct,
);
router.delete('/:id', requireAuth, requireAdmin, productController.deleteProduct);

export default router;
