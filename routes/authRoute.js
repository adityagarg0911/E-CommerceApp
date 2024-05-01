import express from 'express';
import {forgotPasswordController, 
        getAllOrdersController, 
        getOrdersController, 
        loginController, 
        orderStatusController, 
        registerController, 
        testController, 
        updateProfileController} 
from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

// ROUTER OBJECT
const router = express.Router();

// ROUTING

// REGISTER || METHOD: POST
router.post('/register', registerController);

// LOGIN || METHOD: POST
router.post('/login', loginController);

// FORGOT PASSWORD || POST
router.post('/forgot-password', forgotPasswordController)


// TEST ROUTE
router.get('/test', requireSignIn, isAdmin, testController)

// PROTECTED USER ROUTES AUTH
router.get("/user-auth", requireSignIn, (req, res) => {
    return res.status(200).send({ok: true});
}) 

// PROTECTED ADMIN ROUTES AUTH
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    return res.status(200).send({ok: true});
}) 

// UPDATE PROFILE
router.put('/profile', requireSignIn, updateProfileController);

// USER'S ORDERS
router.get('/orders', requireSignIn, getOrdersController);

// ALL ORDERS
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);

// ORDER STATUS UPDATE
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController);

export default router;