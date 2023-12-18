import type { Response } from 'express';

export const genericErrorHandler = (error: unknown, res: Response) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error(error);
    }

    // Check the type of error
    if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
    } else {
        return res.status(500).json(error);
    }
};
