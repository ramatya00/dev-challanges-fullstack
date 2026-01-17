'use server'

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createSnippet(data: {
	code: string,
	language: string,
	theme: string
}) {
	try {
		const snippet = await prisma.snippet.create({
			data: {
				code: data.code,
				language: data.language,
				theme: data.theme
			}
		})

		revalidatePath('/');
		return { success: true, id: snippet.id }
	} catch (error) {
		console.error('Error creating snippet', error);
		return { success: false, error: 'Failed to create snippet' }
	}
}

export async function getSnippetById(id: string) {
	try {
		const snippet = await prisma.snippet.findUnique({ where: { id } });
		if (!snippet) return { success: false, error: 'Snippet not found' }

		return { success: true, data: snippet }
	} catch (error) {
		console.error('Failed to fetch snippet', error);
		return { success: false, error: 'Unable to get snippet' }
	}
}