const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const CategoriesController = require('../controllers/categories-controller');

router.get('/', CategoriesController.getCategories);
router.post(
    '/',
    login.required,
    CategoriesController.postCategory
);
router.get('/:categoryId', CategoriesController.getOneCategory);
router.patch('/', login.required, CategoriesController.updateCategory);
router.delete('/', login.required, CategoriesController.deleteCategory);

module.exports = router;