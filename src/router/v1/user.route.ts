import express from 'express';
import { UserController } from '../../controllers';

const userRoute = express.Router();

// Register a new user
userRoute.post('/register', UserController.registerUser);

// Login a user
userRoute.post('/login', UserController.loginUser);

// Delete (disable) a user
userRoute.delete('/delete/:UID', UserController.disableUser);

// Get all active users
userRoute.get('/active', UserController.getActiveUsers);

export default userRoute;
