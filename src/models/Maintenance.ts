import mongoose, { Schema, models } from "mongoose";

const maintenanceSchema = new Schema({
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  // ✅ แก้ตรงนี้: ลบ enum ออก เพื่อให้รับภาษาไทยได้ทุกคำ
  category: { type: String, required: true }, 
  
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'rejected'], default: 'pending' },
  images: [{ type: String }],
  assignedTo: { type: String },
  completedAt: { type: Date },
}, { timestamps: true });

const Maintenance = models.Maintenance || mongoose.model("Maintenance", maintenanceSchema);
export default Maintenance;