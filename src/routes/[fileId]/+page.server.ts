import { db } from '$lib/server/db';
import { pdfFile } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const fileId = params.fileId;

	if(!fileId){
		redirect(302, "/")
	}

	const file = await db.query.pdfFile.findFirst({
		where: eq(pdfFile.id, fileId)
	})

	if(!file){
		error(404, 'Not found');
	}

	return file


};