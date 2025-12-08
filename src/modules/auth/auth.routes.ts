import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

router.post('/signup', authController.signUpUser);

router.post('/signin', authController.signinUser);

export const authRoute = router;

// User login via /api/v1/auth/signin and receives a JWT (JSON Web Token)
