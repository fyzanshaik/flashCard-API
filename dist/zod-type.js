"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFlashCardSchema = exports.userSignUpSchema = exports.userLoginSchema = exports.flashcardSchema = void 0;
const zod_1 = require("zod");
exports.flashcardSchema = zod_1.z.object({
    title: zod_1.z.string(),
    answer: zod_1.z.string(),
});
exports.userLoginSchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string(),
});
exports.userSignUpSchema = zod_1.z.object({
    firstname: zod_1.z.string(),
    lastname: zod_1.z.string(),
    username: zod_1.z.string(),
    password: zod_1.z.string(),
});
exports.userFlashCardSchema = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string(),
    answer: zod_1.z.string(),
});
