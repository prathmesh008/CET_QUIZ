import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

import MockTest from '../models/MockTestSchema.js';
import User from '../models/userSchema.js';
import Questions from '../models/Questionsschema.js';
import Result from '../models/resultschema.js';

const prisma = new PrismaClient();

async function migrate() {
    try {
        console.log("🚀 Starting Migration...");

        if (!process.env.ATLAS_URI) throw new Error("Missing ATLAS_URI in .env");
        await mongoose.connect(process.env.ATLAS_URI);
        console.log("✅ Connected to MongoDB");

        await prisma.enrollment.deleteMany();
        await prisma.result.deleteMany();
        await prisma.mockTest.deleteMany();
        await prisma.user.deleteMany();
        await prisma.question.deleteMany();
        console.log("🧹 Cleared existing PostgreSQL data");


        console.log("📦 Migrating Questions...");
        const mongoQuestions = await Questions.find().lean();
        const questionIdMap = new Map();

        for (const q of mongoQuestions) {
            const existing = await prisma.question.findFirst({ where: { question: q.question } });
            if (!existing) {
                const created = await prisma.question.create({
                    data: {
                        question: q.question,
                        options: q.options || [],
                        answer: q.answer,
                        numericId: q.id,
                        questionImage: q.questionImage || "",
                        optionImages: q.optionImages || [],
                        inlineImages: q.inlineImages || {},
                        topic: q.topic || "General",
                        subject: q.subject || "General",
                        difficulty: q.difficulty || "Medium",
                        examType: q.examType || (q.topic ? ["General"] : []),
                        createdAt: q.createdAt
                    }
                });
                questionIdMap.set(q._id.toString(), created.id);
            } else {
                questionIdMap.set(q._id.toString(), existing.id);
            }
        }
        console.log(`✅ Migrated ${mongoQuestions.length} Questions`);

        const mapQuestionIds = (mongoIds) => {
            if (!mongoIds || !Array.isArray(mongoIds)) return [];
            return mongoIds.map(mid => questionIdMap.get(mid.toString())).filter(Boolean);
        };

        console.log("👤 Migrating Users...");
        const mongoUsers = await User.find().lean();

        for (const u of mongoUsers) {
            const attemptedIds = mapQuestionIds(u.attemptedQuestions);
            const sessionIds = mapQuestionIds(u.currentSessionQuestions);

            await prisma.user.upsert({
                where: { rollNumber: u.rollNumber },
                update: {},
                create: {
                    username: u.username,
                    rollNumber: u.rollNumber,
                    enrolledExams: u.enrolledExams || ["General"],
                    currentExam: u.currentExam || "General",
                    createdAt: u.createdAt,
                    attemptedQuestions: {
                        connect: attemptedIds.map(id => ({ id }))
                    },
                    currentSessionQuestions: {
                        connect: sessionIds.map(id => ({ id }))
                    }
                }
            });
        }
        console.log(`✅ Migrated ${mongoUsers.length} Users`);

        console.log("📝 Migrating Mock Tests...");
        const mongoTests = await MockTest.find().lean();

        for (const t of mongoTests) {
            const connectedQIds = mapQuestionIds(t.questions);

            const createdTest = await prisma.mockTest.create({
                data: {
                    title: t.title,
                    scheduledDate: t.scheduledDate,
                    duration: t.duration,
                    examType: t.examType,
                    enrolledUsers: t.enrolledUsers || [],
                    createdAt: t.createdAt,
                    questions: {
                        connect: connectedQIds.map(id => ({ id }))
                    }
                }
            });

            if (t.enrollmentDetails && t.enrollmentDetails.length > 0) {
                await prisma.enrollment.createMany({
                    data: t.enrollmentDetails.map(e => ({
                        rollNumber: e.rollNumber,
                        email: e.email,
                        emailSent: e.emailSent || false,
                        mockTestId: createdTest.id
                    }))
                });
            }
        }
        console.log(`✅ Migrated ${mongoTests.length} Mock Tests`);

        console.log("🏆 Migrating Results...");
        const mongoResults = await Result.find().lean();

        for (const r of mongoResults) {
            const mappedResultQIds = (r.questionIds || []).map(qid => {
                const newId = questionIdMap.get(qid.toString());
                return newId || qid.toString();
            });

            await prisma.result.create({
                data: {
                    username: r.username,
                    rollNumber: r.rollNumber,
                    quizId: r.quizId,
                    result: (r.result || []).map(val => (val === null || val === undefined) ? -1 : Number(val)),
                    attempts: r.attempts,
                    points: r.points || 0,
                    acheived: r.acheived || "failed",
                    examType: r.examType || "General",
                    questionIds: mappedResultQIds,
                    createdAt: r.createdAt
                }
            });
        }
        console.log(`✅ Migrated ${mongoResults.length} Results`);

        console.log("\n✨ Migration Completed Successfully!");
    } catch (error) {
        console.error("❌ Migration Failed:", error);
    } finally {
        await prisma.$disconnect();
        await mongoose.disconnect();
        process.exit(0);
    }
}

migrate();