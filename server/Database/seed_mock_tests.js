import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import MockTest from '../models/MockTestSchema.js';
import Questions from '../models/Questionsschema.js';
import { mock1_questions } from './MockData/mock1_data.js';
import { mock2_questions } from './MockData/mock2_data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ATLAS_URI = process.env.ATLAS_URI;

mongoose.connect(ATLAS_URI)
    .then(async () => {
        console.log("Connected to MongoDB for seeding...");

        // Function to insert questions and return their ObjectIds
        const insertQuestions = async (questionsData) => {
            const inserted = await Questions.insertMany(questionsData);
            return inserted.map(q => q._id);
        };

        const now = new Date();
        const tenMinutesFromNow = new Date(now.getTime() + 10 * 60000);
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Seed Questions for Mock 1
        console.log("Seeding Mock 1 Questions...");
        const mock1Ids = await insertQuestions(mock1_questions);

        // Seed Questions for Mock 2
        console.log("Seeding Mock 2 Questions...");
        const mock2Ids = await insertQuestions(mock2_questions);

        const mockTests = [
            {
                title: "IIT-JEE Special Mock (Data File 1)",
                scheduledDate: tenMinutesFromNow,
                duration: 60,
                examType: "IIT-JEE",
                questions: mock1Ids,
                enrolledUsers: []
            },
            {
                title: "NEET Biology Blast (Data File 2)",
                scheduledDate: tomorrow,
                duration: 45,
                examType: "NEET",
                questions: mock2Ids,
                enrolledUsers: []
            }
        ];

        await MockTest.insertMany(mockTests);
        console.log("Mock Tests seeded with specific data files successfully!");
        mongoose.disconnect();
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });
