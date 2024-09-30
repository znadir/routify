import { eq } from "drizzle-orm";
import db from "./db";
import { routineTaskSchema, taskSchema, Routine, Task } from "./schema";

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

export const getRemainingTime = (targetMin: number) => {
	const minElapsedSinceMidnight = new Date().getHours() * 60 + new Date().getMinutes();

	let remainingTime = targetMin - minElapsedSinceMidnight;

	if (remainingTime < 0) {
		remainingTime = 24 * 60 - minElapsedSinceMidnight + targetMin;
	}

	const hours = Math.floor(remainingTime / 60);
	const minutes = (remainingTime % 60).toString().padStart(2, "0");

	if (hours === 0) {
		return `${minutes} min`;
	}

	return `${hours} h ${minutes} min`;
};

export const getRemainingTimeRoutine = async (routineId: number) => {
	const nextTask = await getFirstTaskOfRoutine(routineId);

	const remainingTime = getRemainingTime(nextTask.startDayMin);

	return remainingTime;
};

export const getRemainingTimeEndTask = async (task: Task) => {
	const remainingTime = getRemainingTime(task.endDayMin);

	return remainingTime;
};

export const getProgressTask = async (task: Task) => {
	const minElapsedSinceMidnight = new Date().getHours() * 60 + new Date().getMinutes();

	const taskLength = task.endDayMin - task.startDayMin;
	const taskAchieved = minElapsedSinceMidnight - task.startDayMin;

	const progress = (taskAchieved / taskLength) * 100;

	return progress;
};

export const getNextRoutine = async (routines: Routine[]) => {
	const activeRoutines = routines.filter((routine) => routine.enabled);

	const routineTasksPromises = activeRoutines.map(async (routine) => {
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

	let nextRoutineTask = routineTasks.find(
		(routineTask) => routineTask.firstTask.startDayMin > minElapsedSinceMidnight
	);

	if (!nextRoutineTask) {
		nextRoutineTask = routineTasks[0];
	}

	const nextRoutine = activeRoutines.find((routine) => routine.id === nextRoutineTask.id);

	return nextRoutine;
};

export const getCurrentTask = async (routines: Routine[]) => {
	const activeRoutines = routines.filter((routine) => routine.enabled);

	const routineTasksPromises = activeRoutines.map(async (routine) => {
		const tasks = await getTasks(routine.id);
		return { id: routine.id, tasks };
	});

	const routineTasks = await Promise.all(routineTasksPromises);

	const minElapsedSinceMidnight = new Date().getHours() * 60 + new Date().getMinutes();

	const currentTask = routineTasks
		.flatMap((routineTask) => routineTask.tasks)
		.find(
			(task) =>
				task.startDayMin <= minElapsedSinceMidnight && task.endDayMin >= minElapsedSinceMidnight
		);

	if (!currentTask) {
		return null;
	}

	return currentTask;
};
