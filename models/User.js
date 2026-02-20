import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);