import mongoose from "mongoose";
const { Schema } = mongoose;

const resultmodel = new Schema({
    username: { type: String },
    quizId: { type: String, default: 'quiz1' },
    result: { type: Array, default: [] },
    attempts: { type: Number },
    points: { type: Number, default: 0 },
    acheived: { type: String, default: "failed" }


})

export default mongoose.model("Result", resultmodel);