import mongoose, { Schema, models } from "mongoose";

const utilitySchema = new Schema({
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  month: { type: String, required: true }, // e.g. "11-2025"
  year: { type: Number, required: true },
  waterUsage: { type: Number, required: true }, // Unit
  electricUsage: { type: Number, required: true }, // Unit
  waterRate: { type: Number, required: true }, // Price per unit
  electricRate: { type: Number, required: true }, // Price per unit
  prevWaterReading: { type: Number, required: true },
  currWaterReading: { type: Number, required: true },
  prevElectricReading: { type: Number, required: true },
  currElectricReading: { type: Number, required: true },
}, { timestamps: true });

const Utility = models.Utility || mongoose.model("Utility", utilitySchema);
export default Utility;