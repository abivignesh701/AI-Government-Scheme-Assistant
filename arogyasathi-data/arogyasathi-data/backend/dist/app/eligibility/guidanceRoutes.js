"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guidanceController_1 = require("./guidanceController");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// GET /api/v1/schemes/:scheme_id/guidance
router.get('/schemes/:scheme_id/guidance', authenticate_1.authenticate, guidanceController_1.getGuidance);
// POST /api/v1/applications
router.post('/applications', authenticate_1.authenticate, guidanceController_1.startTracking);
// GET /api/v1/applications
router.get('/applications', authenticate_1.authenticate, guidanceController_1.listTracking);
// GET /api/v1/applications/:tracking_id
router.get('/applications/:tracking_id', authenticate_1.authenticate, guidanceController_1.getTracking);
// PATCH /api/v1/applications/:tracking_id
router.patch('/applications/:tracking_id', authenticate_1.authenticate, guidanceController_1.updateTrackingState);
// POST /api/v1/applications/:tracking_id/checklist
router.post('/applications/:tracking_id/checklist', authenticate_1.authenticate, guidanceController_1.updateChecklist);
exports.default = router;
