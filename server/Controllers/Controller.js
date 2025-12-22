import Questions from "../models/Questionsschema.js";
import results from "../models/resultschema.js";
import User from "../models/userSchema.js";
import quizzes from '../Database/data.js'

export async function getQuestions(req, res) {
    try {
        const { id, ids } = req.query;
        let q;
        if (ids) {
            const idList = ids.split(',');
            q = await Questions.find({ _id: { $in: idList } });
            // Sort q to match the order of idList if necessary, or client handles it
        } else if (id) {
            q = await Questions.find({ quizId: id });
        } else {
            q = await Questions.find();
        }
        res.json(q)
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function insertquestions(req, res) {
    try {
        // Data is already flattened in data.js
        const questionsToInsert = [];

        for (const q of quizzes) {
            // Check if question already exists to prevent duplicates and preserve IDs
            const exists = await Questions.findOne({ question: q.question });
            if (!exists) {
                questionsToInsert.push(q);
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
        const { username, quizId, result, attempts, points, acheived } = req.body;
        if (!username && !result) throw new Error("nodata");

        const data = await results.create({ username, quizId, result, attempts, points, acheived });
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

        let user = await User.findOne({ rollNumber });
        if (!user) {
            user = await User.create({ username, rollNumber });
        } else if (user.username !== username) {
            user.username = username;
            await user.save();
        }

        // 1. Fetch unattempted questions (User Progress Logic)
        // Find questions where _id is NOT in user.attemptedQuestions
        const questionPool = await Questions.find({
            _id: { $nin: user.attemptedQuestions || [] }
        }).limit(24);

        if (questionPool.length === 0) {
            // Edge Case: No questions left.
            // Returning empty array might trigger "No Question Available" on frontend
            // Or we could reset their progress here if desired? 
            // For now, return empty to indicate completion.
            return res.status(404).json({ error: "All questions completed! Great job!" });
        }

        // 2. Construct the Response in the OLD Format (Array of 1 Set Object)
        // Extract pure question objects and separate answers array
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
            points: q.points
        }));

        const responseAnswers = questionPool.map(q => q.answer);

        // 3. Track these questions as "Active Session"
        user.currentSessionQuestions = questionPool.map(q => q._id);
        await user.save();

        const quizId = `practice-${Date.now()}`;

        res.json([{
            questions: responseQuestions,
            answers: responseAnswers,
            quizId: quizId,
            title: "Practice Set"
        }]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function submitPractice(req, res) {
    try {
        const { username, rollNumber, quizId, result, attempts, points, acheived } = req.body;
        if (!username && !result) throw new Error("nodata");

        // 1. Fetch User to get question IDs
        const user = await User.findOne({ rollNumber });
        const questionIds = user ? user.currentSessionQuestions : [];

        // 2. Save the Result (Standard)
        const data = await results.create({ username, rollNumber, quizId, result, attempts, points, acheived, questionIds });

        // 2. Update User Progress
        // Move currentSessionQuestions -> attemptedQuestions
        // 3. Update User Progress
        // Move currentSessionQuestions -> attemptedQuestions
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

        const history = await results.find({ rollNumber }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}