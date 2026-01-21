import prisma from '../Database/prisma.js';
import quizzes from '../Database/data.js'
import { mock1_questions } from '../Database/MockData/mock1_data.js';
import { mock2_questions } from '../Database/MockData/mock2_data.js';


const AVAILABLE_EXAMS = [
    { id: 'IIT-JEE', label: 'IIT-JEE (Engineering)', subjects: ['Physics', 'Chemistry', 'Mathematics'] },
    { id: 'NEET', label: 'NEET (Medical)', subjects: ['Physics', 'Chemistry', 'Biology'] },
    { id: 'Bank PO', label: 'Bank PO', subjects: ['Logical Reasoning', 'Numerical Ability', 'Verbal Ability'] },
    { id: 'SSC', label: 'SSC CGL', subjects: ['General Awareness', 'Reasoning', 'Quant'] },
    { id: 'General', label: 'General Knowledge', subjects: ['General'] }
];

const determineExamType = (topic) => {
    const t = topic?.toLowerCase() || "";
    if (t.includes('logic') || t.includes('numerical') || t.includes('reasoning')) return ['Bank PO', 'SSC'];
    if (t.includes('circadian') || t.includes('biology')) return ['NEET'];
    if (t.includes('verbal')) return ['Bank PO', 'SSC'];
    if (t.includes('physics') || t.includes('chem')) return ['IIT-JEE', 'NEET'];
    if (t.includes('math')) return ['IIT-JEE', 'SSC'];
    return ['General'];
};

export async function getExams(req, res) {
    try {
        res.json(AVAILABLE_EXAMS);
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function updateExamEnrollment(req, res) {
    try {
        const { rollNumber, activeExam } = req.body;
        if (!rollNumber) throw new Error("Roll Number Required");

        let user = await prisma.user.findUnique({ where: { rollNumber } });
        if (!user) throw new Error("User not found (Must start via Login)");

        if (activeExam) {
            const updatedEnrolled = user.enrolledExams.includes(activeExam)
                ? user.enrolledExams
                : [...user.enrolledExams, activeExam];

            user = await prisma.user.update({
                where: { rollNumber },
                data: {
                    currentExam: activeExam,
                    enrolledExams: updatedEnrolled
                }
            });
        }

        res.json({ msg: "Exam Context Updated", currentExam: user.currentExam });
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function getQuestions(req, res) {
    try {
        const { id, ids, examType } = req.query;
        let q = [];

        if (id && id.startsWith('practice-')) {
            const resultRecord = await prisma.result.findMany({
                where: { quizId: id },
                take: 1
            });

            if (resultRecord[0] && resultRecord[0].questionIds && resultRecord[0].questionIds.length > 0) {
                const fetchedQuestions = await prisma.question.findMany({
                    where: { id: { in: resultRecord[0].questionIds } }
                });

                const qMap = new Map(fetchedQuestions.map(item => [item.id, item]));
                q = resultRecord[0].questionIds.map(qid => qMap.get(qid)).filter(Boolean);
            }
        }

        if (q.length === 0) {
            if (ids) {
                const idList = ids.split(',');
                q = await prisma.question.findMany({
                    where: { id: { in: idList } }
                });
            } else if (id) {
                const numeric = parseInt(id);
                if (!isNaN(numeric)) {
                    q = await prisma.question.findMany({ where: { numericId: numeric } });
                } else {
                    q = await prisma.question.findMany({ where: { id: id } });
                }
            } else {
                const query = {};
                if (examType && examType !== 'All') {
                    query.examType = { has: examType };
                }
                q = await prisma.question.findMany({ where: query });
            }
        }

        const transformQuestion = (quest) => ({
            ...quest,
            _id: quest.id,
            id: quest.numericId || quest.id
        });

        if (id || ids) {
            if (q.length > 0) {
                const responseQuestions = q.map(transformQuestion);
                const responseAnswers = q.map(quest => quest.answer);

                res.json([{
                    questions: responseQuestions,
                    answers: responseAnswers,
                    quizId: id || 'custom-set',
                    title: "Quiz"
                }]);
            } else {
                res.json([{ questions: [], answers: [], quizId: id }]);
            }
        } else {
            res.json(q.map(transformQuestion));
        }

    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function insertquestions(req, res) {
    try {
        let count = 0;
        for (const q of quizzes) {
            const exists = await prisma.question.findFirst({ where: { question: q.question } });
            if (!exists) {
                const derivedExamType = q.examType || determineExamType(q.topic);

                await prisma.question.create({
                    data: {
                        question: q.question,
                        options: q.options || [],
                        answer: q.answer,
                        numericId: q.id,
                        questionImage: q.questionImage || "",
                        optionImages: q.optionImages || [],
                        inlineImages: q.inlineImages || {},
                        topic: q.topic || "General",
                        subject: q.subject || q.topic || "General",
                        difficulty: q.difficulty || 'Medium',
                        examType: derivedExamType
                    }
                });
                count++;
            }
        }

        if (count > 0) {
            res.json({ msg: "New questions added successfully", count });
        } else {
            res.json({ msg: "No new questions to add. Database is up to date." });
        }
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function dropquestion(req, res) {
    try {
        await prisma.question.deleteMany();
        res.json({ msg: "Questions deleted" });
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function getResult(req, res) {
    try {
        const r = await prisma.result.findMany();
        res.json(r.map(item => ({ ...item, _id: item.id })));
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function insertResult(req, res) {
    try {
        const { username, quizId, result, attempts, points, acheived, examType, rollNumber } = req.body;
        if (!username && !result) throw new Error("nodata");

        const data = await prisma.result.create({
            data: {
                username,
                rollNumber,
                quizId: quizId || 'quiz1',
                result: result || [],
                attempts,
                points: points || 0,
                acheived: acheived || "failed",
                examType: examType || "General",
            }
        });

        res.json({ msg: "result saved", data: { ...data, _id: data.id } });
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function dropResult(req, res) {
    try {
        await prisma.result.deleteMany();
        res.json({ msg: "result deleted" });
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function startPractice(req, res) {
    try {
        const { username, rollNumber, examType, topic, mockTestId } = req.query;
        if (!username || !rollNumber) throw new Error("Username and Roll Number are required");

        let user = await prisma.user.findUnique({ where: { rollNumber } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    username,
                    rollNumber,
                    currentExam: examType || 'General',
                    enrolledExams: [examType || 'General']
                }
            });
        } else if (examType && user.currentExam !== examType) {
            const updatedEnrolled = user.enrolledExams.includes(examType)
                ? user.enrolledExams
                : [...user.enrolledExams, examType];

            user = await prisma.user.update({
                where: { rollNumber },
                data: {
                    currentExam: examType,
                    enrolledExams: updatedEnrolled
                }
            });
        }

        let questionPool = [];
        let title = "Practice Quiz";
        let quizId = mockTestId || `practice-${Date.now()}`;

        if (mockTestId) {
            const mockTest = await prisma.mockTest.findUnique({
                where: { id: mockTestId },
                include: { questions: true }
            });
            if (!mockTest) throw new Error("Mock Test not found");

            questionPool = mockTest.questions;
            title = mockTest.title;
        } else {
            const targetExam = user.currentExam || 'General';
            title = `${targetExam} Practice`;

            const userWithAttempts = await prisma.user.findUnique({
                where: { rollNumber },
                include: { attemptedQuestions: { select: { id: true } } }
            });

            const attemptedIds = userWithAttempts?.attemptedQuestions.map(q => q.id) || [];

            const whereClause = {
                id: { notIn: attemptedIds },
                examType: { has: targetExam }
            };

            if (topic) {
                whereClause.topic = topic;
                title = `${topic} Practice`;
            }

            questionPool = await prisma.question.findMany({
                where: whereClause,
                take: 24
            });
        }

        if (questionPool.length === 0) {
            return res.status(404).json({ error: `No questions available.` });
        }

        const responseQuestions = questionPool.map(q => ({
            _id: q.id,
            id: q.numericId || q.id,
            question: q.question,
            options: q.options,
            explanation: q.explanation,
            questionImage: q.questionImage,
            optionImages: q.optionImages,
            inlineImages: q.inlineImages,
            topic: q.topic,
            points: q.points,
            examType: q.examType
        }));

        const responseAnswers = questionPool.map(q => q.answer);

        await prisma.user.update({
            where: { rollNumber },
            data: {
                currentSessionQuestions: {
                    set: questionPool.map(q => ({ id: q.id }))
                }
            }
        });

        res.json([{
            questions: responseQuestions,
            answers: responseAnswers,
            quizId: quizId,
            title: title
        }]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function submitPractice(req, res) {
    try {
        const { username, rollNumber, quizId, result, attempts, points, acheived } = req.body;
        if (!username && !result) throw new Error("nodata");

        const user = await prisma.user.findUnique({
            where: { rollNumber },
            include: { currentSessionQuestions: true }
        });

        const sessionQuestions = user ? user.currentSessionQuestions : [];
        const questionIds = sessionQuestions.map(q => q.id);
        const examType = user ? user.currentExam : "General";

        const data = await prisma.result.create({
            data: {
                username,
                rollNumber,
                quizId,
                result,
                attempts,
                points,
                acheived,
                questionIds,
                examType
            }
        });

        if (user && questionIds.length > 0) {
            await prisma.user.update({
                where: { rollNumber },
                data: {
                    attemptedQuestions: {
                        connect: questionIds.map(id => ({ id }))
                    },
                    currentSessionQuestions: { set: [] }
                }
            });
        }

        res.json({ msg: "Result saved and progress updated", data: { ...data, _id: data.id } });
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function getUserHistory(req, res) {
    try {
        const { rollNumber } = req.query;
        if (!rollNumber) throw new Error("Roll Number Required");

        const user = await prisma.user.findUnique({ where: { rollNumber } });
        const examType = user ? user.currentExam : null;

        const whereClause = { rollNumber };
        if (examType) {
            whereClause.examType = examType;
        }

        const history = await prisma.result.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });

        res.json(history.map(h => ({ ...h, _id: h.id })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getMockTests(req, res) {
    try {
        const { examType } = req.query;
        const tests = await prisma.mockTest.findMany({
            where: { examType: examType || 'General' },
            orderBy: { scheduledDate: 'asc' }
        });
        res.json(tests.map(t => ({ ...t, _id: t.id })));
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function createMockTest(req, res) {
    try {
        const { title, scheduledDate, duration, examType, questions } = req.body;
        if (!title || !scheduledDate) throw new Error("Title and Date required");

        const connectQuestions = (questions || []).map(id => ({ id }));

        await prisma.mockTest.create({
            data: {
                title,
                scheduledDate: new Date(scheduledDate),
                duration: duration || 60,
                examType,
                questions: { connect: connectQuestions }
            }
        });
        res.json({ msg: "Mock Test scheduled successfully" });
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function addQuestionsToMockTest(req, res) {
    try {
        const { testId, questionIds } = req.body;
        if (!testId || !questionIds) throw new Error("Data missing");

        await prisma.mockTest.update({
            where: { id: testId },
            data: {
                questions: {
                    connect: questionIds.map(id => ({ id }))
                }
            }
        });
        res.json({ msg: "Questions added" });
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function enrollMockTest(req, res) {
    try {
        const { testId, rollNumber, email } = req.body;
        if (!testId || !rollNumber || !email) throw new Error("Valid Data Required (Test ID, Roll Number, Email)");

        const test = await prisma.mockTest.findUnique({ where: { id: testId } });
        if (!test) throw new Error("Test not found");

        const testEndTime = new Date(test.scheduledDate.getTime() + (test.duration * 60000));
        if (new Date() > testEndTime) {
            throw new Error("Test has already ended. Enrollment is closed.");
        }

        if (!test.enrolledUsers.includes(rollNumber)) {
            await prisma.$transaction([
                prisma.mockTest.update({
                    where: { id: testId },
                    data: {
                        enrolledUsers: { push: rollNumber }
                    }
                }),
                prisma.enrollment.create({
                    data: {
                        rollNumber,
                        email,
                        mockTestId: testId
                    }
                })
            ]);
        }
        res.json({ msg: "Enrolled successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function seedMockTests(req, res) {
    try {
        if (req.query.reset === 'true') {
            await prisma.enrollment.deleteMany();
            await prisma.mockTest.deleteMany();
            await prisma.question.deleteMany();
            console.log("Database cleared.");
        }

        const now = new Date();
        const tenMinutesFromNow = new Date(now.getTime() + 31 * 60000);
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const day2 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
        const day3 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        const insertQuestions = async (questionsData) => {
            const ids = [];
            for (const q of questionsData) {
                const created = await prisma.question.create({
                    data: {
                        question: q.question,
                        options: q.options || [],
                        answer: q.answer,
                        numericId: q.id,
                        questionImage: q.questionImage,
                        optionImages: q.optionImages,
                        topic: q.topic,
                        subject: q.subject,
                        difficulty: q.difficulty,
                        examType: q.examType || (q.topic ? determineExamType(q.topic) : ['General'])
                    }
                });
                ids.push(created.id);
            }
            return ids;
        };

        const mock1Ids = await insertQuestions(mock1_questions);
        const mock2Ids = await insertQuestions(mock2_questions);

        const createTest = async (title, date, duration, type, qIds) => {
            await prisma.mockTest.create({
                data: {
                    title,
                    scheduledDate: date,
                    duration,
                    examType: type,
                    enrolledUsers: [],
                    questions: {
                        connect: qIds.map(id => ({ id }))
                    }
                }
            });
        }

        await createTest("IIT-JEE Special Mock", tenMinutesFromNow, 60, "IIT-JEE", mock1Ids);
        await createTest("mock 1 - Physics", tomorrow, 45, "IIT-JEE", mock2Ids);
        await createTest("mock 1 - Chemistry", day2, 45, "IIT-JEE", mock2Ids);
        await createTest("mock 1 - Biology", day3, 45, "IIT-JEE", mock2Ids);

        res.json({ msg: "Mock Tests and Questions seeded successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function dropMockTests(req, res) {
    try {
        await prisma.mockTest.deleteMany();
        res.json({ msg: "All Mock Tests deleted" });
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function deleteMockTestById(req, res) {
    try {
        const { id } = req.params;
        if (!id) throw new Error("Test ID Required");

        await prisma.mockTest.delete({ where: { id } });
        res.json({ msg: "Mock Test deleted successfully" });
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function getUpcomingEnrolledTests(req, res) {
    try {
        const { rollNumber } = req.query;
        if (!rollNumber) throw new Error("Roll Number Required");

        const now = new Date();
        const tests = await prisma.mockTest.findMany({
            where: {
                enrolledUsers: { has: rollNumber },
                scheduledDate: { gt: now }
            },
            orderBy: { scheduledDate: 'asc' }
        });

        res.json(tests.map(t => ({ ...t, _id: t.id })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}