import { pool } from '../../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';

const signUpUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  //---1---Check---if---email---exists-------------------
  const exists = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (exists.rows.length > 0) {
    throw new Error('Email already exists');
  }

  //---2---Hash---password----------------------------
  const hashedPassword = await bcrypt.hash(password as string, 10);

  //---Insert---new---user-----------------------------
  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, email, hashedPassword, phone, role]
  );

  const user = result.rows[0];

  //---Create---token--------------------------------
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  console.log(token);
  return { token, user };
};

const signinUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return null;
  }

  const signinToken = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    config.JWT_SECRET as string,
    {
      expiresIn: '7d',
    }
  );

  return { signinToken, user };
};

export const authServices = {
  signUpUser,
  signinUser,
};
