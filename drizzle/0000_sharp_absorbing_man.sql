CREATE TABLE `routine` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`enabled` integer DEFAULT false NOT NULL,
	`alarmName` text NOT NULL,
	`enableAlarm` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `routineTask` (
	`id` integer PRIMARY KEY NOT NULL,
	`routineId` integer NOT NULL,
	`taskId` integer NOT NULL,
	FOREIGN KEY (`routineId`) REFERENCES `routine`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`taskId`) REFERENCES `task`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`startDayMin` integer NOT NULL,
	`endDayMin` integer NOT NULL
);
