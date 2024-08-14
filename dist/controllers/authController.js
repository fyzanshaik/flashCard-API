"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const zod_type_1 = require("../zod-type");
// import { hash } from 'crypto';
const prisma = new client_1.PrismaClient();
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, firstname, lastname } = zod_type_1.userSignUpSchema.parse(req.body);
        console.log(username, password, firstname, lastname);
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        console.log(hashedPassword);
        const user = yield prisma.user.create({
            data: {
                firstName: firstname,
                lastName: lastname,
                username,
                password: hashedPassword,
            },
        });
        console.log(user);
        const token = (0, jsonwebtoken_1.sign)({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = zod_type_1.userLoginSchema.parse(req.body);
        console.log(username, password);
        const user = yield prisma.user.findUnique({ where: { username } });
        if (user && (yield bcrypt_1.default.compare(password, user.password))) {
            const token = (0, jsonwebtoken_1.sign)({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        }
        else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }
    catch (error) {
        res.status(400).json({ error: 'Invalid data' });
    }
});
exports.login = login;
