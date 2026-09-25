"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const profilesController_1 = require("./profilesController");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate); // Protect all profile routes
router.post('/', profilesController_1.createProfile);
router.get('/current', profilesController_1.getCurrentProfile);
router.get('/:profile_id', profilesController_1.getProfile);
router.patch('/:profile_id', profilesController_1.updateProfile);
router.post('/:profile_id/review', profilesController_1.reviewProfile);
exports.default = router;
