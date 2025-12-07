import { Request, Response } from 'express';
import { userServices } from './users.service';

const getUsers = async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await userServices.getUsers();

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
    const result = await userServices.getSelectedUser(req.params.id as string);

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
  //---Sending---data---to---db------------------------
  try {
    const result = await userServices.createNewUser(req.body);
    res.json({ message: 'User Created✔️', data: result.rows[0] });
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
    const result = await userServices.updateUser(
      name,
      email,
      password,
      phone,
      role,
      req.params.id as string
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
    const result = await userServices.deleteUser(req.params.id as string);

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
