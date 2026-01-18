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

router.get('/mock-tests', Controller.getMockTests);
router.post('/mock-tests/create', Controller.createMockTest);
router.post('/mock-tests/add-questions', Controller.addQuestionsToMockTest);
router.post('/mock-tests/enroll', Controller.enrollMockTest);

export default router;

