import mongoose from "mongoose";
const { Schema } = mongoose;

const questionmodel = new Schema({
    question: { type: String, default: "" },
    options: { type: [String], default: [] },
    answer: { type: Number, required: true }, 

    
    id: { type: Number },
    questionImage: { type: String, default: "" },
    optionImages: { type: [String], default: [] },
    inlineImages: { type: Object, default: {} },
    topic: { type: String, default: "General" },
    subject: { type: String, default: "General" }, 
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' }, 
    examType: { type: [String] }, 

    createdAt: { type: Date, default: Date.now }
});

const Questions = mongoose.model('Question', questionmodel);
export default Questions;