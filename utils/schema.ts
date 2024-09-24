import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const taskSchema = sqliteTable("task", {
	id: integer("id").primaryKey(),
	name: text("name").notNull(),
	startDayMin: integer("startDayMin").notNull(),
	endDayMin: integer("endDayMin").notNull(),
});

export const routineSchema = sqliteTable("routine", {
	id: integer("id").primaryKey(),
	name: text("name").notNull(),
	enabled: integer("enabled", { mode: "boolean" }).notNull().default(false),
	alarmName: text("alarmName").notNull(),
	enableAlarm: integer("enableAlarm", { mode: "boolean" }).notNull().default(false),
});

export const routineTaskSchema = sqliteTable("routineTask", {
	id: integer("id").primaryKey(),
	routineId: integer("routineId")
		.notNull()
		.references(() => routineSchema.id),
	taskId: integer("taskId")
		.notNull()
		.references(() => taskSchema.id),
});
