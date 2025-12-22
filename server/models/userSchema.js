import mongoose from "mongoose";
const { Schema } = mongoose;

const userModel = new Schema({
    username: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    attemptedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    currentSessionQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userModel);
