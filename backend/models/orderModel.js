import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true }, // Ensure "Object" is capitalized
  status: { type: String, default: "Food Processing" },
  date: { type: Date, default: Date.now() }, // No parentheses in `Date.now`
  payment: { type: Boolean, default: false }, // Fixed spelling of "payment"
});

// Ensure reusability of the model
const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
