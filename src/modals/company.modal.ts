/* eslint-disable @typescript-eslint/no-this-alias */
import { Document, Schema, Model, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique CIDs
import { CompanyCredentials } from "../schemas"; // Import your interface

// Extend CompanyCredentials with Document to include Mongoose-specific properties
interface ICompanyDocument extends CompanyCredentials, Document {}

// Define the company schema
const companySchema = new Schema<ICompanyDocument>(
  {
    CID: {
      type: String,
      unique: true,
      default: () => uuidv4(), // Generate a unique CID by default
    },
    CompanyName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    Address: {
      type: String,
      required: false,
      trim: true,
    },
    Phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^\d{10}$/.test(v); // Validate 10-digit phone numbers
        },
        message: (props: any) => `${props.value} is not a valid phone number!`,
      },
    },
    GSTIN: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/.test(v); // Validate GSTIN format
        },
        message: (props: any) => `${props.value} is not a valid GSTIN!`,
      },
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt timestamps
  }
);

// Create and export the company model
export const Company: Model<ICompanyDocument> = model<ICompanyDocument>('Company', companySchema);
