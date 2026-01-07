// database model using mongoose orm
import { Schema, Document, models, model } from 'mongoose';

export interface IHost extends Document {
    name: string;
    phone: string;
    email:string;
    location: string;
    carsCount: number;
    message: string;
}

const UserSchema = new Schema<IHost>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    location: String,
    carsCount:Number,
    message: String,
  },
  { collection: 'host',timestamps: true }
);

const Host = models.host || model<IHost>('host', UserSchema);

export default Host;