import foodModel from "../models/foodModel.js";
import fs from 'fs';

// add food items
const addFood = async (req, res) => {
    // Check if file is attached
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Image file is required" });
    }

    let image_filename = req.file.filename;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });

    try {
        await food.save();
        res.status(201).json({ success: true, message: "Food item added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error adding food item", error: error.message });
    }
};

//all food list
const listFood = async (req,res)=>{
    try {
        const foods =await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
    }
}

//remove food items
const removeFood = async (req,res)=>{
    try {
        const food=await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Food Removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error removing food item",error:error.message})
    }
}

export { addFood , listFood,removeFood};
