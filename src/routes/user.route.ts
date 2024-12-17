import { Router } from 'express';
import { userController } from '../controllers';
import { pagination } from '@/middlewares/pagination.middleware';


const router = Router();

router.get('/users', pagination, userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.delete('/users/:id', userController.deleteUserById);
router.patch('/users/:id', userController.updateUserById);
router.post('/users/:id', userController.createUser);

export default router;
