import Questions from "../models/Questionsschema.js";
import results from "../models/resultschema.js";
import User from "../models/userSchema.js";
import MockTest from "../models/MockTestSchema.js";
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

        let user = await User.findOne({ rollNumber });
        if (!user) throw new Error("User not found (Must start via Login)");


        if (activeExam) {
            user.currentExam = activeExam;
            if (!user.enrolledExams.includes(activeExam)) {
                user.enrolledExams.push(activeExam);
            }
        }
        await user.save();

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
            const resultRecord = await results.findOne({ quizId: id });
            if (resultRecord && resultRecord.questionIds && resultRecord.questionIds.length > 0) {
                const fetchedQuestions = await Questions.find({ _id: { $in: resultRecord.questionIds } });
                const qMap = new Map(fetchedQuestions.map(item => [item._id.toString(), item]));
                q = resultRecord.questionIds.map(qid => qMap.get(qid.toString())).filter(Boolean);
            }
        }


        if (q.length === 0) {
            if (ids) {
                const idList = ids.split(',');
                q = await Questions.find({ _id: { $in: idList } });
            } else if (id) {
                q = await Questions.find({ quizId: id });
            } else {

                const query = {};
                if (examType && examType !== 'All') {
                    query.examType = { $in: [examType] };
                }
                q = await Questions.find(query);
            }
        }


        if (id || ids) {
            if (q.length > 0) {
                const responseQuestions = q.map(quest => ({
                    _id: quest._id,
                    id: quest.id,
                    question: quest.question,
                    options: quest.options,
                    explanation: quest.explanation,
                    questionImage: quest.questionImage,
                    optionImages: quest.optionImages,
                    inlineImages: quest.inlineImages,
                    topic: quest.topic,
                    points: quest.points,
                    examType: quest.examType
                }));
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
            res.json(q);
        }

    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function insertquestions(req, res) {
    try {
        const questionsToInsert = [];

        for (const q of quizzes) {
            const exists = await Questions.findOne({ question: q.question });
            if (!exists) {

                const derivedExamType = q.examType || determineExamType(q.topic);
                const derivedSubject = q.subject || q.topic;

                questionsToInsert.push({
                    ...q,
                    examType: derivedExamType,
                    subject: derivedSubject,
                    difficulty: q.difficulty || 'Medium'
                });
            }
        }

        if (questionsToInsert.length > 0) {
            const data = await Questions.insertMany(questionsToInsert);
            res.json({ msg: "New questions added successfully", count: data.length });
        } else {
            res.json({ msg: "No new questions to add. Database is up to date." });
        }
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function dropquestion(req, res) {
    try {
        await Questions.deleteMany()
        res.json({ msg: "Questions deleted" })
    } catch (error) {
        res.json({ error })
    }
}

export async function getResult(req, res) {
    try {
        const r = await results.find()
        res.json(r)
    } catch (error) {
        res.json({ error })
    }
}

export async function insertResult(req, res) {
    try {
        const { username, quizId, result, attempts, points, acheived, examType, rollNumber } = req.body;
        if (!username && !result) throw new Error("nodata");

        const data = await results.create({
            username,
            rollNumber,
            quizId,
            result,
            attempts,
            points,
            acheived,
            examType: examType || "General"
        });
        res.json({ msg: "result saved", data });
    } catch (error) {
        res.json({ error });
    }
}

export async function dropResult(req, res) {
    try {
        await results.deleteMany();
        res.json({ msg: "result deleted" })
    } catch (error) {
        res.json({ error })
    }
}

export async function startPractice(req, res) {
    try {
        const { username, rollNumber, examType, topic, mockTestId } = req.query;
        if (!username || !rollNumber) throw new Error("Username and Roll Number are required");

        let user = await User.findOne({ rollNumber });
        if (!user) {
            user = await User.create({ username, rollNumber, currentExam: examType || 'General', enrolledExams: [examType || 'General'] });
        } else if (examType && user.currentExam !== examType) {
            user.currentExam = examType;
            if (!user.enrolledExams.includes(examType)) {
                user.enrolledExams.push(examType);
            }
            await user.save();
        }

        let questionPool = [];
        let title = "Practice Quiz";

        if (mockTestId) {
            // --- MOCK TEST LOGIC ---
            const mockTest = await MockTest.findById(mockTestId).populate('questions');
            if (!mockTest) throw new Error("Mock Test not found");

            questionPool = mockTest.questions;
            title = mockTest.title;
        } else {
            // --- PRACTICE / TOPIC LOGIC ---
            const targetExam = user.currentExam || 'General';
            title = `${targetExam} Practice`;

            const query = {
                _id: { $nin: user.attemptedQuestions || [] },
                examType: { $in: [targetExam] }
            };

            if (topic) {
                query.topic = topic;
                title = `${topic} Practice`;
            }

            questionPool = await Questions.find(query).limit(24);
        }

        if (questionPool.length === 0) {
            return res.status(404).json({ error: `No questions available.` });
        }

        const responseQuestions = questionPool.map(q => ({
            _id: q._id,
            id: q.id,
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

        // Store session questions for result calculation
        user.currentSessionQuestions = questionPool.map(q => q._id);
        await user.save();

        const quizId = mockTestId || `practice-${Date.now()}`;

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

        const user = await User.findOne({ rollNumber });
        const questionIds = user ? user.currentSessionQuestions : [];
        const examType = user ? user.currentExam : "General";

        const data = await results.create({
            username,
            rollNumber,
            quizId,
            result,
            attempts,
            points,
            acheived,
            questionIds,
            examType: examType
        });

        if (user) {
            await User.updateOne(
                { rollNumber },
                {
                    $addToSet: { attemptedQuestions: { $each: user.currentSessionQuestions || [] } },
                    $set: { currentSessionQuestions: [] }
                }
            );
        }

        res.json({ msg: "Result saved and progress updated", data });
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function getUserHistory(req, res) {
    try {
        const { rollNumber } = req.query;
        if (!rollNumber) throw new Error("Roll Number Required");

        const user = await User.findOne({ rollNumber });
        const examType = user ? user.currentExam : null;

        const query = { rollNumber };
        if (examType) {
            query.examType = examType;
        }

        const history = await results.find(query).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getMockTests(req, res) {
    try {
        const { examType } = req.query;
        const tests = await MockTest.find({ examType: examType || 'General' }).sort({ scheduledDate: 1 });
        res.json(tests);
    } catch (error) {
        res.json({ error });
    }
}

export async function createMockTest(req, res) {
    try {
        const { title, scheduledDate, duration, examType, questions } = req.body;
        if (!title || !scheduledDate) throw new Error("Title and Date required");

        await MockTest.create({ title, scheduledDate, duration, examType, questions: questions || [] });
        res.json({ msg: "Mock Test scheduled successfully" });
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function addQuestionsToMockTest(req, res) {
    try {
        const { testId, questionIds } = req.body;
        if (!testId || !questionIds) throw new Error("Data missing");

        const test = await MockTest.findById(testId);
        if (!test) throw new Error("Test not found");

        test.questions.push(...questionIds);
        await test.save();
        res.json({ msg: "Questions added" });
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function enrollMockTest(req, res) {
    try {
        const { testId, rollNumber, email } = req.body;
        if (!testId || !rollNumber || !email) throw new Error("Valid Data Required (Test ID, Roll Number, Email)");

        const test = await MockTest.findById(testId);
        if (!test) throw new Error("Test not found");

        if (!test.enrolledUsers.includes(rollNumber)) {
            test.enrolledUsers.push(rollNumber);
            test.enrollmentDetails.push({ rollNumber, email });
            await test.save();
        }
        res.json({ msg: "Enrolled successfully" });
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function seedMockTests(req, res) {
    try {
        // Check if we should clear existing data
        if (req.query.reset === 'true') {
            await MockTest.deleteMany({});
            await Questions.deleteMany({});
            console.log("Database cleared.");
        }

        // Helper to insert questions
        const insertQuestions = async (questionsData) => {
            const inserted = await Questions.insertMany(questionsData);
            return inserted.map(q => q._id);
        };

        const now = new Date();
        const tenMinutesFromNow = new Date(now.getTime() + 31 * 60000);
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Seed Questions
        const mock1Ids = await insertQuestions(mock1_questions);
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

        res.json({ msg: "Mock Tests and Questions seeded successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function dropMockTests(req, res) {
    try {
        await MockTest.deleteMany();
        res.json({ msg: "All Mock Tests deleted" });
    } catch (error) {
        res.json({ error: error.message });
    }
}