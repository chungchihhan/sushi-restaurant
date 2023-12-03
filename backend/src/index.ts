import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import os from 'os';

import MealRoutes from './routes/meal';
import OrderRoutes from './routes/order';
import OrderItemRoutes from './routes/orderItem';
import ReviewRoutes from './routes/review';
import ShopRoutes from './routes/shop';
import UserRoutes from './routes/user';
// We use a custom env.ts file to make sure that all the environment variables
// are in correct types.
import { env } from './utils/env';

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api/user', UserRoutes);
app.use('/api/shop', ShopRoutes);
app.use('/api/meal', MealRoutes);
app.use('/api/review', ReviewRoutes);
app.use('/api/order', OrderRoutes);
app.use('/api/orderItem', OrderItemRoutes);

app.use('/heartbeat', (req, res) => {
    console.log('req');
    return res.send({
        hostname: os.hostname(),
        network: Object.values(os.networkInterfaces())
            .flat()
            .find((i) => i?.family === 'IPv4' && !i.internal),
    });
});

app.use('/', (req, res) => {
    // home page
    return res.send({ message: 'The server is ready!' });
});

// Connect to MongoDB
mongoose
    .connect(env.MONGO_URL)
    .then(() => {
        app.listen(env.PORT as number, '0,0,0,0', () =>
            console.log(`Server running on port http://localhost:${env.PORT}`),
        );
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Failed to connect to MongoDB');
        console.log(error.message);
    });
