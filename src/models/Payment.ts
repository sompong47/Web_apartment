import mongoose, { Schema, models } from "mongoose";

const paymentSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  
  // ถ้ามีการเพิ่ม field title ในอนาคตให้ใส่ตรงนี้
  // title: { type: String },

  month: { type: String, required: true },
  year: { type: Number, required: true },
  rentAmount: { type: Number, required: true },
  waterBill: { type: Number, default: 0 },
  electricBill: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  
  status: { 
    type: String, 
    // สำคัญ: ต้องมี 'unpaid' ในนี้
    enum: ['unpaid', 'pending', 'paid', 'overdue'], 
    default: 'unpaid' 
  },
  
  paymentDate: { type: Date },
  receipt: { type: String },
}, { timestamps: true });

// ป้องกันการ Compile Model ซ้ำ
const Payment = models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;