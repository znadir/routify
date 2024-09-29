import { eq } from "drizzle-orm";
import db from "./db";
import { routineTaskSchema, taskSchema } from "./schema";

export function timeRangeToString(startDayMin: number, endDayMin: number) {
	const startHour = Math.floor(startDayMin / 60);
	const startMinute = startDayMin % 60;
	const endHour = Math.floor(endDayMin / 60);
	const endMinute = endDayMin % 60;
	return `${startHour}:${startMinute.toString().padStart(2, "0")} to ${endHour}:${endMinute
		.toString()
		.padStart(2, "0")}`;
}

export const getTasks = async (routineId: number) => {
	if (!routineId) {
		return [];
	}

	const routineTasks = await db
		.select()
		.from(routineTaskSchema)
		.where(eq(routineTaskSchema.routineId, routineId));

	const routineTaskIds = routineTasks.map((task) => task.taskId);

	const tasksPromises = routineTaskIds.map(async (routineTaskId) => {
		const routineTask = await db.select().from(taskSchema).where(eq(taskSchema.id, routineTaskId));
		return routineTask[0];
	});

	const tasks = await Promise.all(tasksPromises);

	return tasks;
};
