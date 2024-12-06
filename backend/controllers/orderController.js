
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    // Save the new order
    const newOrder = new orderModel({
      userId: req.body.user._id,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();

    // Clear user's cart data
    await userModel.findByIdAndUpdate(req.body.user._id, { cartData: {} });

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
      line_items,
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

export { placeOrder };
