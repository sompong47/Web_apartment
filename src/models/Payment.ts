import mongoose, { Schema, models } from "mongoose";

const paymentSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  rentAmount: { type: Number, required: true },
  waterBill: { type: Number, default: 0 },
  electricBill: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  paymentDate: { type: Date },
  receipt: { type: String }, // URL image
}, { timestamps: true });

const Payment = models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;