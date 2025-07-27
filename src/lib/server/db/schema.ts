import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const pdfFile = pgTable("pdf_file", {
	id: uuid('id').defaultRandom().primaryKey(),
	content: text('content'),
	fileName: text('file_name').notNull(),
	fileUrl: text('file_url').notNull(),

	updated_at: timestamp(),
	created_at: timestamp().defaultNow().notNull(),
})