/* eslint-disable @typescript-eslint/no-this-alias */
import { Document, Schema, Model, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique RIDs
import { RoleCredentials } from "../schemas"; // Import your interface

// Extend RoleCredentials with Document to include Mongoose-specific properties
interface IRoleDocument extends RoleCredentials, Document {}

// Define the role schema
const roleSchema = new Schema<IRoleDocument>(
  {
    RID: {
      type: String,
      unique: true,
      default: () => uuidv4(), // Generate a unique RID by default
    },
    Name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt timestamps
  }
);

// Create and export the role model
export const Role: Model<IRoleDocument> = model<IRoleDocument>('Role', roleSchema);
