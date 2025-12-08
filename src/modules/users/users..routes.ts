import { Router } from 'express';
import { userControllers } from './users.controller';
import auth from '../../middleware/auth';

const router = Router();

//---Users---Get---All--------------------------------------------
router.get('/', auth('admin', 'customer'), userControllers.getUsers);
//---Users---Get---One--------------------------------------------
router.get('/:id', auth('admin', 'customer'), userControllers.getSelectedUser);
//---Users---Create---One-----------------------------------------
router.post('/', auth('admin', 'customer'), userControllers.createNewUser);
//---Users---Update---One-----------------------------------------
router.put('/:id', auth('admin', 'customer'), userControllers.updateUser);
//---Users---Delete---One-----------------------------------------
router.delete('/:id', auth('admin', 'customer'), userControllers.deleteUser);

export const usersRoute = router;
