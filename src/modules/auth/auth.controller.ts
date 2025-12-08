import { Request, Response } from 'express';
import { authServices } from './auth.services';

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.loginUser(email, password);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: req.body,
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

const signinUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.signinUser(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { ...req.body },
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

export const authController = {
  loginUser,
  signinUser,
};
