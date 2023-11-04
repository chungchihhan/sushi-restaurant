import type { Response } from "express";
import { MongooseError } from "mongoose";

export const genericErrorHandler = (error: unknown, res: Response) => {
  console.error(error);

  // Check the type of error
  if (error instanceof MongooseError) {
    return res.status(500).json({ error: error.message });
  } else if (error instanceof Error) {
    return res.status(500).json({ error: error.message });
  } else {
    return res.status(500).json(error);
  }
};

  
// check the id format is correct for mongodb
export const checkIdFormat = (id: string, res: Response) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({error: 'Invalid id format for mongodb'});
  }
}