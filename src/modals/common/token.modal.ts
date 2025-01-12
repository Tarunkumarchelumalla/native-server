import { Document, Schema, model } from 'mongoose';
import { userTokenSchema } from '../../schemas';

const userTokenInfo = new Schema<userTokenSchema & Document>(
  {
    Token: {
      type: [String],  // Corrected type definition for an array of strings
      required: true,
      trim: true,
    },
    UID: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,  // Automatically manage createdAt and updatedAt fields
  }
);

export const UserTokenInfo = model<userTokenSchema & Document>(
  'UserToken',
  userTokenInfo
);
