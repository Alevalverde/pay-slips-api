import { Router } from 'express';
import { userController } from '../controllers';
import { pagination } from '@/middlewares/pagination.middleware';
import { authorize } from '@/middlewares/auth.middleware';

const router = Router();

router.post('/users', authorize, userController.createUser);
router.get('/users', authorize, pagination, userController.getAllUsers);
router.get('/users/:id', authorize, userController.getUserById);
router.patch('/users/:id', authorize, userController.updateUserById);
router.delete('/users/:id', authorize, userController.deleteUserById);

export default router;
