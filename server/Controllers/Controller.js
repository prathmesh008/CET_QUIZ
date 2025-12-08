import Questions from "../models/Questionsschema.js";
import results from "../models/resultschema.js";
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