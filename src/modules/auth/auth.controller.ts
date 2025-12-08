import { Request, Response } from 'express';
import { authServices } from './auth.services';

// const loginUser = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     const result = await authServices.loginUser(email, password);

//     res.status(201).json({
//       success: true,
//       message: 'User registered successfully',
//       data: req.body,
//     });
//   } catch (err: unknown) {
//     let message = 'Internal Server Error';
//     if (err instanceof Error) message = err.message;

//     return res.status(500).json({
//       success: false,
//       message,
//     });
//   }
// };

// const signinUser = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     const result = await authServices.signinUser(email, password, signinToken);

//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       token: signinToken,
//       data: { ...req.body },
//     });
//   } catch (err: unknown) {
//     let message = 'Internal Server Error';
//     if (err instanceof Error) message = err.message;

//     return res.status(500).json({
//       success: false,
//       message,
//     });
//   }
// };

// export const authController = {
//   loginUser,
//   signinUser,
// };

const signinUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.signinUser(email, password);

    if (!result) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: result.signinToken,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone,
          role: result.user.role,
        },
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Internal Server Error';

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

const signUpUser = async (req: Request, res: Response) => {
  // const { email, password } = req.body;

  try {
    const result = await authServices.signUpUser(req.body);

    if (!result) {
      return res.status(400).json({
        success: false,
        message: 'Registration failed',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token: result.token,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone,
          role: result.user.role,
        },
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Internal Server Error';

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

export const authController = {
  signUpUser,
  signinUser,
};
