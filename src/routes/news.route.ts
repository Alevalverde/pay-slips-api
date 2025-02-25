import { Router } from 'express';
import { newsController } from '../controllers';

const router = Router();

router.get('/news', newsController.getAllNews);

export default router;
