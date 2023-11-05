import type { Response } from 'express';

export const genericErrorHandler = (error: unknown, res: Response) => {
    console.error(error);

    // Check the type of error
    if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
    } else {
        return res.status(500).json(error);
    }
};
