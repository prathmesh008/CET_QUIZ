import mongoose from "mongoose";
const { Schema } = mongoose;

const userModel = new Schema({
    username: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true }, // Added rollNumber as unique identifier
    completedSet: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userModel);
