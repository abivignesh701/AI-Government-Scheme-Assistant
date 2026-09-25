"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("./chatController");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// POST /api/v1/assistant/chat
router.post('/assistant/chat', authenticate_1.authenticate, chatController_1.handleChat);
exports.default = router;
