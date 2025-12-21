import Questions from "../models/Questionsschema.js";
import results from "../models/resultschema.js";
import User from "../models/userSchema.js";
import quizzes from '../Database/data.js'

export async function getQuestions(req, res) {
    try {
        const { id } = req.query;
        let q;
        if (id) {
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
        const data = await Questions.insertMany(quizzes);
        res.json({ msg: "data saved", data });
    } catch (error) {
        res.json({ error: error.message });
    }
}

export async function dropquestion(req, res) {
    try {
        await Questions.deleteMany()
        res.json({ msg: "question deleted" })
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

        // Find by rollNumber as it is unique
        let user = await User.findOne({ rollNumber });
        if (!user) {
            // Create new user if rollNumber doesn't exist
            user = await User.create({ username, rollNumber });
        } else if (user.username !== username) {
            // Optional: Update username if it changed for the same roll number
            user.username = username;
            await user.save();
        }

        const nextSet = user.completedSet + 1;
        const q = await Questions.findOne({ setNumber: nextSet });

        if (!q) {
            return res.status(404).json({ error: "In Development" });
        }

        res.json([q]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function submitPractice(req, res) {
    try {
        const { username, rollNumber, quizId, result, attempts, points, acheived } = req.body;
        if (!username && !result) throw new Error("nodata");

        const data = await results.create({ username, rollNumber, quizId, result, attempts, points, acheived });

        // Update progress regardless of pass/fail
        const quiz = await Questions.findOne({ quizId });
        if (quiz) {
            // Find by rollNumber
            await User.findOneAndUpdate(
                { rollNumber },
                { $max: { completedSet: quiz.setNumber } }
            );
        }

        res.json({ msg: "result saved", data });
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