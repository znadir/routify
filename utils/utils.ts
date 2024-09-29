import { eq } from "drizzle-orm";
import db from "./db";
import { routineTaskSchema, taskSchema, Routine } from "./schema";

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

export const getFirstTaskOfRoutine = async (routineId: number) => {
	const tasks = await getTasks(routineId);

	// sort ascending by start time
	const sortedTasks = tasks.sort((a, b) => a.startDayMin - b.startDayMin);

	const minElapsedSinceMidnight = new Date().getHours() * 60 + new Date().getMinutes();

	const nextTask = sortedTasks.find((task) => task.startDayMin > minElapsedSinceMidnight);

	if (!nextTask) {
		return sortedTasks[0];
	}

	return nextTask;
};

export const getRemainingTime = async (routineId: number) => {
	const minElapsedSinceMidnight = new Date().getHours() * 60 + new Date().getMinutes();

	// find the first task that hasn't started yet
	const nextTask = await getFirstTaskOfRoutine(routineId);

	const nextStartTime = nextTask.startDayMin;

	let remainingTime = nextStartTime - minElapsedSinceMidnight;

	if (remainingTime < 0) {
		remainingTime = 24 * 60 - minElapsedSinceMidnight + nextStartTime;
	}

	const hours = Math.floor(remainingTime / 60);
	const minutes = remainingTime % 60;

	return `${hours} h ${minutes} min`;
};

export const getNextRoutine = async (routines: Routine[]) => {
	const routineTasksPromises = routines.map(async (routine) => {
		const firstTask = await getFirstTaskOfRoutine(routine.id);
		return { id: routine.id, firstTask };
	});

	const routineTasks = await Promise.all(routineTasksPromises);

	routineTasks.sort((a, b) => {
		const aTime = a.firstTask.startDayMin;
		const bTime = b.firstTask.startDayMin;
		return aTime - bTime;
	});

	const minElapsedSinceMidnight = new Date().getHours() * 60 + new Date().getMinutes();

	const nextRoutine = routineTasks.find(
		(routineTask) => routineTask.firstTask.startDayMin > minElapsedSinceMidnight
	);

	if (!nextRoutine) {
		return routineTasks[0];
	}

	return nextRoutine;
};
