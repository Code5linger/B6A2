import { Router } from 'express';
import { userControllers } from './users.controller';
import auth from '../../middleware/auth';

const router = Router();

//---Users---Get---All--------------------------------------------
router.get('/', auth(), userControllers.getUsers);
//---Users---Get---One--------------------------------------------
router.get('/:id', userControllers.getSelectedUser);
//---Users---Create---One-----------------------------------------
router.post('/', userControllers.createNewUser);
//---Users---Update---One-----------------------------------------
router.put('/:id', userControllers.updateUser);
//---Users---Delete---One-----------------------------------------
router.delete('/:id', userControllers.deleteUser);

export const usersRoute = router;
