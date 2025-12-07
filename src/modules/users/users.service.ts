import { Request, Response } from 'express';
import { pool } from '../../config/db';

const getUsers = async (req: Request, res: Response) => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

export const userServices = {
  getUsers,
};
