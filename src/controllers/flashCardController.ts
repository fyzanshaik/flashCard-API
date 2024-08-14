import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { flashcardSchema } from '../zod-type';
import { AuthenticatedRequest } from '../utils/types';

const prisma = new PrismaClient();

export const getAllCards = async (req: AuthenticatedRequest, res: Response) => {
	const user = req.user;

	try {
		let flashCards;

		if (!user) {
			flashCards = await prisma.publicFlashCard.findMany({
				orderBy: {
					id: 'asc',
				},
			});
		} else {
			flashCards = await prisma.userFlashCard.findMany({
				where: {
					userId: user.userId,
				},
				orderBy: {
					id: 'asc',
				},
			});
		}

		res.json(flashCards);
	} catch (error) {
		console.error('Error fetching flashcards:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const addFlashCard = async (req: AuthenticatedRequest, res: Response) => {
	const user = req.user;

	try {
		const data = flashcardSchema.parse(req.body);
		let newCard;

		if (!user) {
			newCard = await prisma.publicFlashCard.create({
				data: {
					title: data.title,
					answer: data.answer,
				},
			});
		} else {
			newCard = await prisma.userFlashCard.create({
				data: {
					title: data.title,
					answer: data.answer,
					userId: user.userId,
				},
			});
		}

		res.json(newCard);
	} catch (error) {
		console.error('Error adding flashcard:', error);
		res.status(400).json({ error: 'Invalid data' });
	}
};

export const editCard = async (req: AuthenticatedRequest, res: Response) => {
	const { id } = req.params;
	const user = req.user;

	try {
		const data = flashcardSchema.parse(req.body);
		let updatedCard;

		if (!user) {
			updatedCard = await prisma.publicFlashCard.update({
				where: { id: Number(id) },
				data: {
					title: data.title,
					answer: data.answer,
				},
			});
		} else {
			updatedCard = await prisma.userFlashCard.update({
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
		}

		res.json(updatedCard);
	} catch (error) {
		console.error('Error updating card:', error);
		res.status(400).json({ error: 'Invalid data or card not found' });
	}
};

export const deleteCard = async (req: AuthenticatedRequest, res: Response) => {
	const { id } = req.params;
	const user = req.user;

	try {
		if (!user) {
			await prisma.publicFlashCard.delete({ where: { id: Number(id) } });
			res.json({ message: 'Public card deleted successfully' });
		} else {
			await prisma.userFlashCard.delete({
				where: {
					id_userId: {
						id: Number(id),
						userId: user.userId,
					},
				},
			});
			res.json({ message: 'User card deleted successfully' });
		}
	} catch (error) {
		console.error('Error deleting card:', error);
		res.status(400).json({ error: 'Invalid data or card not found' });
	}
};
