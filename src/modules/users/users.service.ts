import { pool } from '../../config/db';
import bcrypt from 'bcryptjs';

const getUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const getSelectedUser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
  return result;
};

const createNewUser = async (payload: Record<string, unknown>) => {
  //---Getting---data---from---Postman/Browser-Form----
  const { name, email, password, phone, role } = payload;

  const encryptedPassword = await bcrypt.hash(password as string, 10);

  const result = pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, encryptedPassword, phone, role]
  );
  return result;
};
//-------------------------------
const updateUser = async (payload: Record<string, unknown>, id: string) => {
  // Build dynamic SET clause
  const fields: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  if (payload.name) {
    fields.push(`name=$${index++}`);
    values.push(payload.name);
  }
  if (payload.email) {
    fields.push(`email=$${index++}`);
    values.push(payload.email);
  }
  if (payload.phone) {
    fields.push(`phone=$${index++}`);
    values.push(payload.phone);
  }
  if (payload.role) {
    fields.push(`role=$${index++}`);
    values.push(payload.role);
  }
  if (payload.password) {
    const hashed = await bcrypt.hash(payload.password as string, 10);
    fields.push(`password=$${index++}`);
    values.push(hashed);
  }

  if (fields.length === 0) {
    return null; // Nothing to update
  }

  values.push(id); // Add id for WHERE clause

  const result = await pool.query(
    `UPDATE users SET ${fields.join(
      ', '
    )} WHERE id=$${index} RETURNING id, name, email, phone, role`,
    values
  );

  return result;
};

//-------------------------------

const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result;
};

export const userServices = {
  getUsers,
  getSelectedUser,
  createNewUser,
  updateUser,
  deleteUser,
};
