"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const explanationController_1 = require("./explanationController");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// GET /api/v1/profiles/:profile_id/explanations
router.get('/profiles/:profile_id/explanations', authenticate_1.authenticate, explanationController_1.getExplanations);
// GET /api/v1/schemes/:scheme_id
router.get('/schemes/:scheme_id', authenticate_1.authenticate, explanationController_1.getSchemeDetail);
exports.default = router;
