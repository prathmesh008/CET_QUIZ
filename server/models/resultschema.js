import mongoose from "mongoose";
const { Schema } = mongoose;

const resultmodel = new Schema({
    username: { type: String },
    rollNumber: { type: String }, // Added rollNumber
    quizId: { type: String, default: 'quiz1' },
    result: { type: Array, default: [] },
    attempts: { type: Number },
    points: { type: Number, default: 0 },
    acheived: { type: String, default: "failed" },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Result", resultmodel);