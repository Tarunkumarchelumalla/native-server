/* eslint-disable @typescript-eslint/no-this-alias */
import { Document, Schema, Model, model } from "mongoose";
import { UserRole } from "../schemas"; // Import your interface

// Extend UserRole with Document to include Mongoose-specific properties
interface IUserRoleDocument extends UserRole, Document {}

// Define the user role schema
const userRoleSchema = new Schema<IUserRoleDocument>(
  {
    UID: {
      type: String,
      required: true,
      trim: true,
    },
    RID: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt timestamps
  }
);

// Create and export the user role model
export const LinkUserRole: Model<IUserRoleDocument> = model<IUserRoleDocument>('LinkUserRole', userRoleSchema);
