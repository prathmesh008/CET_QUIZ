import mongoose from "mongoose";
const { Schema } = mongoose;

const mockTestModel = new Schema({
    title: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    duration: { type: Number, default: 60 }, // minutes
    examType: { type: String, default: 'General' },
    enrolledUsers: { type: [String], default: [] }, // Stores rollNumbers
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('MockTest', mockTestModel);
