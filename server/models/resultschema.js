import mongoose from "mongoose";
const { Schema } = mongoose;

const resultmodel = new Schema({
    username: { type: String },
    rollNumber: { type: String }, 
    quizId: { type: String, default: 'quiz1' },
    result: { type: Array, default: [] },
    questionIds: { type: [String], default: [] }, 
    attempts: { type: Number },
    points: { type: Number, default: 0 },
    acheived: { type: String, default: "failed" },
    examType: { type: String, default: "General" }, 
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Result", resultmodel);