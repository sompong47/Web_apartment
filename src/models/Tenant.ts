import mongoose, { Schema, models } from "mongoose";

const tenantSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  deposit: { type: Number, required: true },
  status: { type: String, enum: ['active', 'terminated'], default: 'active' },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  }
}, { timestamps: true });

const Tenant = models.Tenant || mongoose.model("Tenant", tenantSchema);
export default Tenant;