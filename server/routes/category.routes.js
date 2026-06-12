import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validators/category.validator.js';

const router = Router();

router.get('/', categoryController.listCategories);
router.get('/:slug', categoryController.getCategory);

router.post(
  '/',
  requireAuth,
  requireAdmin,
  validate(createCategorySchema),
  categoryController.createCategory,
);
router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  validate(updateCategorySchema),
  categoryController.updateCategory,
);
router.delete('/:id', requireAuth, requireAdmin, categoryController.deleteCategory);

export default router;
