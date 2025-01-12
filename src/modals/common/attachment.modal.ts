import { Document, Schema, model } from 'mongoose';
import paginate from '../plugins/paginate.plugin';
import { toJSON } from '../plugins/toJson.plugin';
import { AttachementSchema } from '../../schemas';

const AttachmentSchema = new Schema<AttachementSchema & Document>(
  {
    FileName:{
        type: String,
        trim: true,
    },
    FileType:{
      type:String,
      trim:true
    },
    Url:{
        type: String,
        trim: true,
    },
    Hash:{
        type: String,
        trim: true,
    }

  },
  {
    timestamps: true,
  }
);

AttachmentSchema.plugin(toJSON);
AttachmentSchema.plugin(paginate);

export const Attachments = model<AttachementSchema & Document>('attchements', AttachmentSchema);
