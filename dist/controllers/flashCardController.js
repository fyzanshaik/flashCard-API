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
exports.deleteCard = exports.editCard = exports.addFlashCard = exports.getAllCards = void 0;
const client_1 = require("@prisma/client");
const zod_type_1 = require("../zod-type");
const redisClient_1 = __importDefault(require("../redisClient"));
const prisma = new client_1.PrismaClient();
const getAllCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        let flashCards;
        if (!user) {
            const cachedData = yield redisClient_1.default.get('publicFlashCards');
            if (cachedData) {
                console.log('Serving from cache');
                return res.json(JSON.parse(cachedData));
            }
            flashCards = yield prisma.publicFlashCard.findMany({
                orderBy: {
                    id: 'asc',
                },
            });
            yield redisClient_1.default.setEx('publicFlashCards', 3600, JSON.stringify(flashCards)); // Cache for 1 hour
        }
        else {
            const cacheKey = `userFlashCards:${user.userId}`;
            const cachedData = yield redisClient_1.default.get(cacheKey);
            if (cachedData) {
                console.log('Serving from cache');
                return res.json(JSON.parse(cachedData));
            }
            flashCards = yield prisma.userFlashCard.findMany({
                where: {
                    userId: user.userId,
                },
                orderBy: {
                    id: 'asc',
                },
            });
            yield redisClient_1.default.setEx(cacheKey, 3600, JSON.stringify(flashCards)); // Cache for 1 hour
        }
        res.json(flashCards);
    }
    catch (error) {
        console.error('Error fetching flashcards:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getAllCards = getAllCards;
const addFlashCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        let newCard;
        const data = zod_type_1.flashcardSchema.parse(req.body);
        if (!user) {
            newCard = yield prisma.publicFlashCard.create({
                data: {
                    title: data.title,
                    answer: data.answer,
                },
            });
            yield redisClient_1.default.del('publicFlashCards'); // Invalidate cache
        }
        else {
            newCard = yield prisma.userFlashCard.create({
                data: {
                    title: data.title,
                    answer: data.answer,
                    userId: user.userId,
                },
            });
            yield redisClient_1.default.del(`userFlashCards:${user.userId}`); // Invalidate cache
        }
        res.json(newCard);
    }
    catch (error) {
        console.error('Error adding flashcard:', error);
        res.status(400).json({ error: 'Invalid data' });
    }
});
exports.addFlashCard = addFlashCard;
const editCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    try {
        const data = zod_type_1.flashcardSchema.parse(req.body);
        let updatedCard;
        if (!user) {
            updatedCard = yield prisma.publicFlashCard.update({
                where: { id: Number(id) },
                data: {
                    title: data.title,
                    answer: data.answer,
                },
            });
            yield redisClient_1.default.del('publicFlashCards'); // Invalidate cache
        }
        else {
            updatedCard = yield prisma.userFlashCard.update({
                where: {
                    id_userId: {
                        id: Number(id),
                        userId: user.userId,
                    },
                },
                data: {
                    title: data.title,
                    answer: data.answer,
                },
            });
            yield redisClient_1.default.del(`userFlashCards:${user.userId}`); // Invalidate cache
        }
        res.json(updatedCard);
    }
    catch (error) {
        console.error('Error updating card:', error);
        res.status(400).json({ error: 'Invalid data or card not found' });
    }
});
exports.editCard = editCard;
const deleteCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    try {
        if (!user) {
            yield prisma.publicFlashCard.delete({ where: { id: Number(id) } });
            yield redisClient_1.default.del('publicFlashCards'); // Invalidate cache
            res.json({ message: 'Public card deleted successfully' });
        }
        else {
            yield prisma.userFlashCard.delete({
                where: {
                    id_userId: {
                        id: Number(id),
                        userId: user.userId,
                    },
                },
            });
            yield redisClient_1.default.del(`userFlashCards:${user.userId}`); // Invalidate cache
            res.json({ message: 'User card deleted successfully' });
        }
    }
    catch (error) {
        console.error('Error deleting card:', error);
        res.status(400).json({ error: 'Invalid data or card not found' });
    }
});
exports.deleteCard = deleteCard;
