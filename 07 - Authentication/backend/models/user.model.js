import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        verifyOtp: {
            type: String,
            default: ''

        },
        verifyOtpExpireAt: {
            type: Number,
            default: 0

        },
        isAccountVerified: {
            type: Boolean,
            default: false
        },
        resetOtp: {
            type: String,
            default: ''
        },
        resetOtpExpireAt: {
            type: Number,
            default: 0
        },
    },
    { timestamps: true }
);

// Correct model assignment
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
