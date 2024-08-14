"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts or server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const flashCardRoute_1 = __importDefault(require("./routes/flashCardRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const helloWorld_1 = __importDefault(require("./routes/helloWorld"));
const rateLimiter_1 = require("./rateLimiter");
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
const corsOptions = {
    origin: ['https://frontend-flash-61iiaohr4-fyzanshaiks-projects.vercel.app', 'https://frontend-flash-phi.vercel.app', 'http://localhost:5173/dashboard'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use('/api', rateLimiter_1.apiRateLimiter, flashCardRoute_1.default);
app.use('/api/auth', rateLimiter_1.authRateLimiter, authRoute_1.default);
app.use('/', helloWorld_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
exports.default = app;
