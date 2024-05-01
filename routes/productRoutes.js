import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { brainTreePaymentController, braintreeTokenController, createProductController, 
        deleteProductController, 
        getProductController, 
        getSingleProductController, 
        productCategoryController, 
        productCountController, 
        productFiltersController, 
        productListController, 
        productPhotoController, 
        relatedProductController, 
        searchProductController, 
        updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable';

const router = express.Router();

// Routes

// CREATE PRODUCT
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);

// UPDATE PRODUCT
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);

// GET SINGLE PRODUCT
router.get('/get-product/:slug', getSingleProductController);

// GET PRODUCTS
router.get('/get-product', getProductController);

// GET PHOTO
router.get('/product-photo/:pid', productPhotoController);

// DELETE PRODUCT
router.delete('/delete-product/:pid', deleteProductController);

// FILTER PRODUCT
router.post('/product-filters', productFiltersController)

// PRODUCT COUNT
router.get('/product-count', productCountController);

// PAGE WISE PRODUCT
router.get('/product-list/:page', productListController);

// SEARCH
router.get('/search/:keyword', searchProductController);

// SIMILAR PRODUCTS
router.get('/related-product/:pid/:cid', relatedProductController);

// CATEGORYWISE PRODUCTS
router.get('/product-category/:slug', productCategoryController);

// PAYMENTS ROUTE

// TOKEN
router.get('/braintree/token', braintreeTokenController);

// PAYMENTS
router.post('/braintree/payment', requireSignIn, brainTreePaymentController);

export default router;