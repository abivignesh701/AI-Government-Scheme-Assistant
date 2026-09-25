"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const connection_1 = require("./app/database/connection");
const routes_1 = __importDefault(require("./app/auth/routes"));
const profilesRoutes_1 = __importDefault(require("./app/api/profilesRoutes"));
const documentsRoutes_1 = __importDefault(require("./app/api/documentsRoutes"));
const questionsRoutes_1 = __importDefault(require("./app/eligibility/questionsRoutes"));
const explanationRoutes_1 = __importDefault(require("./app/eligibility/explanationRoutes"));
const guidanceRoutes_1 = __importDefault(require("./app/eligibility/guidanceRoutes"));
const chatRoutes_1 = __importDefault(require("./app/ai/chatRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use((0, cors_1.default)({ origin: allowedOrigin }));
app.use(express_1.default.json());
// Routes
app.use('/api/v1/auth', routes_1.default);
app.use('/api/v1/profiles', profilesRoutes_1.default);
app.use('/api/v1/profiles', documentsRoutes_1.default);
app.use('/api/v1/profiles', questionsRoutes_1.default);
app.use('/api/v1', explanationRoutes_1.default);
app.use('/api/v1', guidanceRoutes_1.default);
app.use('/api/v1', chatRoutes_1.default);
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok', service: 'arogyasathi-backend' });
});
(0, connection_1.connectDB)().then(() => {
    app.listen(port, () => {
        console.log(`Backend API listening on port ${port}`);
    });
}).catch(err => {
    console.error("Failed to start server", err);
    process.exit(1);
});
exports.default = app;
