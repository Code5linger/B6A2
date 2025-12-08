import { Request, Response } from 'express';
import { userServices } from './users.service';

const getUsers = async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await userServices.getUsers();

    //---Map over users and remove the password field----
    const users = result.rows.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    }));

    //---Check if empty---------------------------
    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No users found',
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
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

//--------------------------------------------------
const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = req.user as { id: number; role: string } | undefined;
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No user info found',
      });
    }

    if (currentUser.role !== 'admin' && currentUser.id !== Number(id)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can update only your own profile',
      });
    }

    const userId = id!;
    const result = await userServices.updateUser(req.body, userId);

    if (!result || result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found ❌',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0],
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Internal Server Error';
    return res.status(500).json({ success: false, message });
  }
};

//---------------------------------------------------

const deleteUser = async (req: Request, res: Response) => {
  //---Receiving---data---from---db------------------------
  try {
    const result = await userServices.deleteUser(req.params.id as string);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
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
