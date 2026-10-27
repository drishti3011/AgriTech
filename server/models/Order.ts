import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  resource: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface IOrderTimeline {
  status: string;
  timestamp: Date;
  note: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'rejected';
  shippingAddress: {
    fullName: string;
    phone: string;
    village: string;
    district: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'Cash on Delivery (Kisan Pay)' | 'UPI' | 'Direct Bank Transfer';
  timeline: IOrderTimeline[];
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, required: true, unique: true },
  items: [
    {
      resource: { type: Schema.Types.ObjectId, ref: 'Resource' },
      name: { type: String, required: true },
      category: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      unit: { type: String, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'shipped', 'delivered', 'rejected'],
    default: 'pending',
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    village: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery (Kisan Pay)', 'UPI', 'Direct Bank Transfer'],
    default: 'Cash on Delivery (Kisan Pay)',
  },
  timeline: [
    {
      status: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      note: { type: String, default: '' },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
