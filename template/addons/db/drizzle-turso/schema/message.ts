import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const message = sqliteTable("message", {
  id: int().primaryKey({ autoIncrement: true }),
  content: text().notNull(),
});
