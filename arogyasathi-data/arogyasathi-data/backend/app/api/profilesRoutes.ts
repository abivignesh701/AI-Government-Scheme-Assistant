import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { 
  createProfile, 
  getProfile, 
  updateProfile, 
  getCurrentProfile, 
  reviewProfile 
} from './profilesController';

const router = Router();

router.use(authenticate); // Protect all profile routes

router.post('/', createProfile);
router.get('/current', getCurrentProfile);
router.get('/:profile_id', getProfile);
router.patch('/:profile_id', updateProfile);
router.post('/:profile_id/review', reviewProfile);

export default router;
