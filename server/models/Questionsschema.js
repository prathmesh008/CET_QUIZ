import mongoose from "mongoose";
const { Schema } = mongoose;

const questionmodel = new Schema({
    question: { type: String, default: "" },
    options: { type: [String], default: [] },
    answer: { type: Number, required: true }, // Correct Option Index

    // Optional Medata
    id: { type: Number },
    questionImage: { type: String, default: "" },
    optionImages: { type: [String], default: [] },
    inlineImages: { type: Object, default: {} },
    topic: { type: String, default: "General" },
    subject: { type: String, default: "General" }, // New Field
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' }, // New Field
    examType: { type: [String] }, // New Field: IIT-JEE, NEET, SSC, etc.

    createdAt: { type: Date, default: Date.now }
});

const Questions = mongoose.model('Question', questionmodel);
export default Questions;