import Questions from "../models/Questionsschema.js";
import results from "../models/resultschema.js";
import User from "../models/userSchema.js";
import quizzes from '../Database/data.js'

// --- Helpers ---
const AVAILABLE_EXAMS = [
    { id: 'IIT-JEE', label: 'IIT-JEE (Engineering)', subjects: ['Physics', 'Chemistry', 'Mathematics'] },
    { id: 'NEET', label: 'NEET (Medical)', subjects: ['Physics', 'Chemistry', 'Biology'] },
    { id: 'Bank PO', label: 'Bank PO', subjects: ['Logical Reasoning', 'Numerical Ability', 'Verbal Ability'] },
    { id: 'SSC', label: 'SSC CGL', subjects: ['General Awareness', 'Reasoning', 'Quant'] },
    { id: 'General', label: 'General Knowledge', subjects: ['General'] }
];

const determineExamType = (topic) => {
    // Map topics to Exams
    const t = topic?.toLowerCase() || "";
    if (t.includes('logic') || t.includes('numerical') || t.includes('reasoning')) return ['Bank PO', 'SSC'];
    if (t.includes('circadian') || t.includes('biology')) return ['NEET'];
    if (t.includes('verbal')) return ['Bank PO', 'SSC'];
    if (t.includes('physics') || t.includes('chem')) return ['IIT-JEE', 'NEET'];
    if (t.includes('math')) return ['IIT-JEE', 'SSC'];
    return ['General']; // Default
};

// --- Endpoints ---

// --- Endpoints ---

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

        // Allow creating user here effectively if logic changes, but safer to rely on session start
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

        // Special handling for Retaking Practice Quizzes (which use dynamic IDs)
        if (id && id.startsWith('practice-')) {
            const resultRecord = await results.findOne({ quizId: id });
            if (resultRecord && resultRecord.questionIds && resultRecord.questionIds.length > 0) {
                const fetchedQuestions = await Questions.find({ _id: { $in: resultRecord.questionIds } });
                const qMap = new Map(fetchedQuestions.map(item => [item._id.toString(), item]));
                q = resultRecord.questionIds.map(qid => qMap.get(qid.toString())).filter(Boolean);
            }
        }

        // Standard Fetch
        if (q.length === 0) {
            if (ids) {
                const idList = ids.split(',');
                q = await Questions.find({ _id: { $in: idList } });
            } else if (id) {
                q = await Questions.find({ quizId: id });
            } else {
                // Filter by Exam Type if provided
                const query = {};
                if (examType && examType !== 'All') {
                    query.examType = { $in: [examType] };
                }
                q = await Questions.find(query);
            }
        }

        // Wrapper for specialized clients
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
                // Auto-tagging fallback
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
        const { username, rollNumber } = req.query;
        if (!username || !rollNumber) throw new Error("Username and Roll Number are required");

        // 1. Fetch User Context
        let user = await User.findOne({ rollNumber });
        if (!user) {
            // In this logic, user must exist. But for robustness:
            // If coming from login this shouldn't happen usually
            // If we fallback, assume 'General'
            user = await User.create({ username, rollNumber, currentExam: 'General', enrolledExams: ['General'] });
        }

        const targetExam = user.currentExam || 'General';

        // Fetch unattempted questions filtered by Exam Type
        // We look for questions that contain the targetExam in their examType array
        let questionPool = await Questions.find({
            _id: { $nin: user.attemptedQuestions || [] },
            examType: { $in: [targetExam] }
        }).limit(24);

        if (questionPool.length === 0) {
            // Reset Progress logic if needed, OR just return empty saying content exhausted
            return res.status(404).json({ error: `No more questions available for ${targetExam}.` });
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

        // Track session
        user.currentSessionQuestions = questionPool.map(q => q._id);
        await user.save();

        const quizId = `practice-${Date.now()}`;

        res.json([{
            questions: responseQuestions,
            answers: responseAnswers,
            quizId: quizId,
            title: `${targetExam} Practice`
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