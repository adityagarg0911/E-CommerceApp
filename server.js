import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cors from 'cors';

// CONFIG ENV
dotenv.config();

// DATABASE CONFIG
connectDB();

// REST OBJECT
const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ROUTES
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

app.get('/', (req, res) => {
    res.send({
        message: "welcome welcome"
    })
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})                                          