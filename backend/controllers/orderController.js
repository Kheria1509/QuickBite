import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";

  try {
    // Save the new order
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();

    // Clear user's cart data
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Create line items for Stripe
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr", // Fixed typo: "Currency" → "currency"
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects unit amount in the smallest currency unit
      },
      quantity: item.quantity,
    }));

    // Add delivery charges to line items
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: Math.round(20 * 100), // Corrected calculation for delivery charges
      },
      quantity: 1,
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items:line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    // Respond with the session URL
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error in placeOrder:", error.message); // Log error for debugging
    res.status(500).json({ success: false, message: "Failed to place order." });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    // No need to check admin role - handled by middleware
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error listing orders" });
  }
};

// API for updating status
const updateStatus = async (req, res) => {
  try {
    // No need to check admin role - handled by middleware
    const { orderId, status } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }
    
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }
    
    // Validate status values
    const validStatuses = ["Food Processing", "Out for delivery", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid status. Must be one of: Food Processing, Out for delivery, Delivered" 
      });
    }
    
    // Find the order first to verify it exists
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    
    // Update the order status
    order.status = status;
    await order.save();
    
    res.json({ 
      success: true, 
      message: "Status Updated Successfully",
      data: { orderId, status }
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
