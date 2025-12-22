import mongoose from "mongoose";
const { Schema } = mongoose;

const questionmodel = new Schema({
    question: { type: String, default: "" },
    options: { type: [String], default: [] },
    answer: { type: Number, required: true }, // Correct Option Index

    // Optional Medata
    id: { type: Number }, // Maintain legacy ID if needed
    points: { type: Number, default: 1 },
    explanation: { type: String, default: "" },
    questionImage: { type: String, default: "" },
    optionImages: { type: [String], default: [] },
    inlineImages: { type: Object, default: {} },
    topic: { type: String, default: "General" },

    createdAt: { type: Date, default: Date.now }
});

const Questions = mongoose.model('Question', questionmodel);
export default Questions;