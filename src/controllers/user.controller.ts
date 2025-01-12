import { Request, Response } from 'express';
import { User } from '../modals/common/user.modal';
import jwt from 'jsonwebtoken';
import { UserTokenInfo } from '../modals'; // Assuming a model for UserToken is created
import { JWT_SECRET } from '../config';


export class UserController {
  // Register a new user
  static async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { Name, Email, Password, CID } = req.body;

      const existingUser = await User.findOne({ Name });
      if (existingUser) {
        res.status(400).json({ message: 'Email already exists' });
        return;
      }

      const user = new User({ Name, Email, Password, CID });
      await user.save();

      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error });
    }
  }

  // Login a user
  static async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { Name, Password } = req.body;
  
      // Find the user by Name
      const user = await User.findOne({ Name });
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      // Check if the password matches
      const isMatch = await user.isPasswordMatch(Password);
      if (!isMatch) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }
  
      // Generate a token
      const token = jwt.sign({ UID: user.UID, Name: user.Name }, JWT_SECRET, { expiresIn: '1h' });
  
      // Save the token in the UserToken collection
      let userTokenInfo = await UserTokenInfo.findOne({ UID: user.UID });
  
      if (!userTokenInfo) {
        // Create a new UserToken entry if it doesn't exist
        userTokenInfo = new UserTokenInfo({ UID: user.UID, Token: [token] });
      } else {
        // Add the new token to the existing array
        userTokenInfo.Token.push(token);
      }
  
      // Save the updated token information
      await userTokenInfo.save();
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  }

  // Disable a user (set IsActive to false)
  static async disableUser(req: Request, res: Response): Promise<void> {
    try {
      const { UID } = req.params;

      const user = await User.findOneAndUpdate({ UID }, { IsActive: false }, { new: true });
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({ message: 'User disabled successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error disabling user', error });
    }
  }

  // Get all active users
  static async getActiveUsers(_: Request, res: Response): Promise<void> {
    try {
      const users = await User.find({ IsActive: true });

      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching active users', error });
    }
  }
}
