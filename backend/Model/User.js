import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
},
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
)

const UserModel = mongoose.model("User", userSchema);
export default UserModel