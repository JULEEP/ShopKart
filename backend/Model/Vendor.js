import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
    },
    phone: {
        type: Number,
        required: true,
        trim: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    companyName:{
        type: String,
        required: true,
    },
},
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
)

const VendorModel = mongoose.model("Vendor", vendorSchema);
export default VendorModel