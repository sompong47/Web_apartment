import mongoose, { Schema, models } from "mongoose";

const roomSchema = new Schema({
  roomNumber: { type: String, required: true, unique: true },
  floor: { type: Number, required: true },
  type: { type: String, enum: ['single', 'double', 'studio'], required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
  amenities: [{ type: String }],
  images: [{ type: String }],
}, { timestamps: true });

const Room = models.Room || mongoose.model("Room", roomSchema);
export default Room;