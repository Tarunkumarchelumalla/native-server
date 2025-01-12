/* eslint-disable @typescript-eslint/no-this-alias */
import { Document, Schema, Model, model } from "mongoose";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UserCredentials } from "../../schemas"; // Import your interface

// Extend UserCredentials with Document to include Mongoose-specific properties
interface IUserDocument extends UserCredentials, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

// Define the user schema
const userSchema = new Schema<IUserDocument>(
  {
    UID: {
      type: String,
      unique: true,
      default: () => uuidv4(), // Generate a unique UID by default
    },
    Name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    Password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    CID: {
      type: String,
      required: true,
      trim: true,
    },
    IsActive: {
      type: Boolean,
      default: true, // Users are active by default
    },
  },
  {
    timestamps: true,
  }
);

// Add a method to compare passwords
userSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
  const user = this;
  return bcrypt.compare(password, user.Password);
};

// Hash the password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('Password')) {
    user.Password = await bcrypt.hash(user.Password, 8);
  }
  next();
});

// Create and export the user model
export const User: Model<IUserDocument> = model<IUserDocument>('User', userSchema);
