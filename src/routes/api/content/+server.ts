import { db } from '$lib/server/db';
import { pdfFile } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    const { fileName, fileUrl, htmlContent } = await request.json();
    const result = await db.insert(pdfFile).values({
        fileName,
        content: htmlContent,
        fileUrl,
    }).returning();
    const fileId = result[0].id
    return json({
        success: true,
        fileId,
    });
};

export const PATCH: RequestHandler = async ({ request }) => {
    const { fileId, htmlContent } = await request.json();
    const result = await db.update(pdfFile).set({
        content: htmlContent,
    }).where(eq(pdfFile.id, fileId)).returning();
    return json({
        success: true,
    });
};