import foodModel from "../models/foodModel.js";
import fs from 'fs';
import path from 'path';

// Add food items
const addFood = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image file is required" });
  }

  const image_filename = req.file.filename;
  const { name, description, price, category } = req.body;

  const food = new foodModel({
    name,
    description,
    price,
    category,
    image: image_filename
  });

  try {
    // No need to check for admin role - already handled by middleware
    await food.save();
    res.status(201).json({ success: true, message: "Food added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// List all food items
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Remove food items
const removeFood = async (req, res) => {
  const { id } = req.body;

  try {
    // No need to check for admin role - already handled by middleware
    const food = await foodModel.findById(id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found." });
    }

    const imagePath = path.join("uploads", food.image);
    fs.unlink(imagePath, (err) => {
      if (err) console.error(err);
    });

    await foodModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Food removed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { addFood, listFood, removeFood };