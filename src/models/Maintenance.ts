import mongoose, { Schema, models } from "mongoose";

const maintenanceSchema = new Schema({
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['plumbing', 'electrical', 'furniture', 'other'] },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  images: [{ type: String }],
}, { timestamps: true });

const Maintenance = models.Maintenance || mongoose.model("Maintenance", maintenanceSchema);
export default Maintenance;