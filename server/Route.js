import { Router } from "express";
const router = Router();
import * as Controller from './Controllers/Controller.js';

router.route('/questions')
    .get(Controller.getQuestions)
    .post(Controller.insertquestions)
    .delete(Controller.dropquestion);


router.route('/result')
    .get(Controller.getResult)
    .post(Controller.insertResult)
    .delete(Controller.dropResult);

router.get('/practice/start', Controller.startPractice);
router.post('/practice/submit', Controller.submitPractice);
router.get('/user/history', Controller.getUserHistory);


router.get('/exams', Controller.getExams);
router.post('/user/enroll', Controller.updateExamEnrollment);

export default router;

