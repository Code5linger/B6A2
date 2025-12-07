import { Request, Response } from 'express';
import { pool } from '../../config/db';
import { userServices } from './users.service';

const getUsers = async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await userServices.getUsers;

    res.status(200).json({
      success: true,
      message: 'Users Data Received ✔️',
      data: result.rows,
    });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

const getSelectedUser = async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found ❌',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User Found✔️',
      data: result.rows[0],
    });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

const createNewUser = async (req: Request, res: Response) => {
  //---Getting---data---from---Postman/Browser-Form----
  const { name, email, password, phone, role } = req.body;

  //---Sending---data---to---db------------------------
  try {
    const result = await pool.query(
      `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, password, phone, role]
    );
    console.log(result.rows[0]);

    res.json({ message: 'User Created✔️' });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  //---Getting---data---from---Postman/Browser-Form----
  const { name, email, password, phone, role } = req.body;
  //---Receiving---data---from---db------------------------
  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, password=$3, phone=$4, role=$5 WHERE id=$6 RETURNING *`,
      [name, email, password, phone, role, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found ❌',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User Updated Successfully ✔️',
      data: result.rows[0],
    });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await pool.query(`DELETE FROM users WHERE id=$1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found ❌',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User Deleted ✔️',
      data: result.rows[0],
    });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error) message = err.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

export const userControllers = {
  getUsers,
  getSelectedUser,
  createNewUser,
  updateUser,
  deleteUser,
};
