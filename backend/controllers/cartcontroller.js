import userModel from "../models/userModel.js"



//add items to user cart
const addToCart = async (req,res) =>{
    try {
        let userData = await userModel.findById(req.body.userId);
        
        // Initialize cartData if it doesn't exist or is not an object
        if (!userData.cartData || typeof userData.cartData !== 'object') {
            userData.cartData = {};
        }
        
        let cartData = userData.cartData;
        
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({success: true, message: "Added to cart"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error adding to cart: " + error.message});
    }
}

//remove items from user cart
const removeFromCart = async (req,res) =>{
    try {
        let userData = await userModel.findById(req.body.userId);
        
        // Initialize cartData if it doesn't exist or is not an object
        if (!userData.cartData || typeof userData.cartData !== 'object') {
            userData.cartData = {};
        }
        
        let cartData = userData.cartData;
        
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({success: true, message: "Removed from cart"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error removing from cart: " + error.message});
    }
}


//fetch user card data
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        
        // Initialize cartData if it doesn't exist or is not an object
        if (!userData.cartData || typeof userData.cartData !== 'object') {
            userData.cartData = {};
            await userData.save();
        }
        
        let cartData = userData.cartData;
        res.json({success: true, message: "Cart data retrieved successfully", cartData});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error retrieving cart data: " + error.message});
    }
}

export {addToCart,removeFromCart,getCart}