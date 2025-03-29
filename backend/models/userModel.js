import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      verifyOtp:{type:String,default:''},
      verifyOtpExpireAt:{type:Number,default:0},
      isVerified:{type:Boolean,default:false},
      resetOtp:{type:String,default:''},
      resetOtpExpireAt:{type:Number,default:0},
      refreshToken: { type: String, default: null },
      role: {
        type: String,
        default: "user",
        enum: ["user", "admin"], // Only allow specific roles
      },
      cartData: {
        type: mongoose.Schema.Types.Mixed, // Allow both object and array structure
        default: {}, // Default to empty object to avoid validation errors
      },
    },
    { minimize: false }
  );

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;