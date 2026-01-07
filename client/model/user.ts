// database model using mongoose orm
import { Schema, Document, models, model } from 'mongoose';

export interface IUser extends Document {
    location: string;
    tripStart: Date;
    tripEnd: Date;
    name: string;
    phone: string;
    message: string;
}

const UserSchema = new Schema<IUser>(
  {
    location: { type: String, required: true },
    tripStart: { type: Date, required: true },
    tripEnd: { type: Date, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true }
  },
  { collection: 'user',timestamps: true }
);

const User = models.User || model<IUser>('User', UserSchema);

export default User;