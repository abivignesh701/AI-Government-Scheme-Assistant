"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const questionsController_1 = require("./questionsController");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// GET /api/v1/profiles/:profile_id/questions
router.get('/:profile_id/questions', authenticate_1.authenticate, questionsController_1.getQuestionPlan);
// POST /api/v1/profiles/:profile_id/questions/answer
router.post('/:profile_id/questions/answer', authenticate_1.authenticate, questionsController_1.answerQuestion);
exports.default = router;
