import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import UserRoutes from './routes/user';
// We use a custom env.ts file to make sure that all the environment variables
// are in correct types.
import { env } from './utils/env';

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api/user', UserRoutes);

app.use('/heartbeat', (req, res) => {
    console.log('req');
    return res.send({ message: 'Hi there!' });
});

// Connect to MongoDB
mongoose
    .connect(env.MONGO_URL)
    .then(() => {
        app.listen(env.PORT as number, '0.0.0.0', () =>
            console.log(`Server running on port http://localhost:${env.PORT}`),
        );
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Failed to connect to MongoDB');
        console.log(error.message);
    });
