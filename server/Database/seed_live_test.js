import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import MockTest from '../models/MockTestSchema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ATLAS_URI = process.env.ATLAS_URI;

mongoose.connect(ATLAS_URI)
    .then(async () => {
        console.log("Connected to MongoDB for seeding...");

        const now = new Date();
        const justNow = new Date(now.getTime() - 1 * 60000); // 1 minute ago, so it's live

        const mockTests = [
            {
                title: "Live Urgent Mock Test",
                scheduledDate: justNow,
                duration: 60,
                examType: "General",
                enrolledUsers: []
            }
        ];

        await MockTest.insertMany(mockTests);
        console.log("Mock Tests seeded successfully!");
        mongoose.disconnect();
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });
