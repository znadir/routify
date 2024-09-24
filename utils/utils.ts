export function timeRangeToString(startDayMin: number, endDayMin: number) {
	const startHour = Math.floor(startDayMin / 60);
	const startMinute = startDayMin % 60;
	const endHour = Math.floor(endDayMin / 60);
	const endMinute = endDayMin % 60;
	return `${startHour}:${startMinute.toString().padStart(2, "0")} to ${endHour}:${endMinute
		.toString()
		.padStart(2, "0")}`;
}
