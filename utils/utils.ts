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

	const sortedTasks = tasks.sort((a, b) => a.startDayMin - b.startDayMin);

	return sortedTasks;
};

export const deleteTasks = async (routineId: number) => {
	const tasks = await getTasks(routineId);

	tasks.forEach(async (task) => {
		await db.delete(taskSchema).where(eq(taskSchema.id, task.id));
	});

	await db.delete(routineTaskSchema).where(eq(routineTaskSchema.routineId, routineId));
};

export const getRemainingTime = async (routineId: number) => {
	const tasks = await getTasks(routineId);
	const sortedTasks = tasks.sort((a, b) => a.startDayMin - b.startDayMin);

	const minElapsedSinceMidnight = new Date().getHours() * 60 + new Date().getMinutes();

	// find the first task that hasn't started yet
	const nextTask = sortedTasks.find((task) => task.startDayMin > minElapsedSinceMidnight);

	const nextStartTime = nextTask ? nextTask.startDayMin : sortedTasks[0].startDayMin;

	const remainingTime = nextStartTime - minElapsedSinceMidnight;

	const hours = Math.floor(remainingTime / 60);
	const minutes = remainingTime % 60;

	return `${hours} h ${minutes} min`;
};
