import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const task = sqliteTable("task", {
	id: integer("id").primaryKey(),
	name: text("name").notNull(),
	startDayMin: integer("startDayMin").notNull(),
	endDayMin: integer("endDayMin").notNull(),
});

export const routine = sqliteTable("routine", {
	id: integer("id").primaryKey(),
	name: text("name").notNull(),
	enabled: integer("enabled", { mode: "boolean" }).notNull().default(false),
	alarmName: text("alarmName").notNull(),
	enableAlarm: integer("enableAlarm", { mode: "boolean" }).notNull().default(false),
});

export const routineTask = sqliteTable("routineTask", {
	id: integer("id").primaryKey(),
	routineId: integer("routineId")
		.notNull()
		.references(() => routine.id),
	taskId: integer("taskId")
		.notNull()
		.references(() => task.id),
});
