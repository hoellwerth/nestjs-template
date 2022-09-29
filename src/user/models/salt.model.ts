import * as Mongoose from 'mongoose';

export const SaltSchema = new Mongoose.Schema({
  userId: { type: String, required: true },
  salt: { type: String, required: true },
});

export interface Salt {
  userId: string;
  salt: string;
}
