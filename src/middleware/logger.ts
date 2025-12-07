import { Request, Response } from 'express';

const logger = (req: Request, res: Response) => {
  console.log('Logger 🪵');
};

export default logger;
