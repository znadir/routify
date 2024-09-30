import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import ThemedText from "../components/ThemedText";
import RoutineCard from "@/components/RoutineCard";
import { setBackgroundColorAsync } from "expo-navigation-bar";
import CircularProgress from "react-native-circular-progress-indicator";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { routineSchema, Task } from "../utils/schema";
import db from "../utils/db";
import { router } from "expo-router";
import PlusIcon from "@/assets/svg/plus-icon.svg";
import NoRoutine from "@/assets/svg/no-routine.svg";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import {
	getCurrentTask,
	getNextRoutine,
	getProgressTask,
	getRemainingTimeEndTask,
	getRemainingTimeRoutine,
} from "@/utils/utils";
import { useEffect, useState } from "react";

export default function Index() {
	setBackgroundColorAsync("black");

	const { data } = useLiveQuery(db.select().from(routineSchema));
	const { success, error } = useMigrations(db, migrations);
	const [routineTimes, setRoutineTimes] = useState<{ id: number; timeRemaining: string }[]>([]);
	const [nextRoutineTime, setNextRoutineTime] = useState<String | null>();
	const [currentTask, setCurrentTask] = useState<Task | null>();
	const [remainingTimeEndTask, setRemainingTimeEndTask] = useState<String | null>();
	const [progressTask, setProgressTask] = useState<number>(0);

	useEffect(() => {
		const fetchTimes = async () => {
			const times = await Promise.all(
				data.map(async (routine) => {
					const timeRemaining = await getRemainingTimeRoutine(routine.id);
					return { id: routine.id, timeRemaining };
				})
			);

			setRoutineTimes(times);

			// Update next routine time
			const nextRoutine = await getNextRoutine(data);
			if (nextRoutine) {
				const nextRoutineTime = await getRemainingTimeRoutine(nextRoutine.id);
				setNextRoutineTime(nextRoutineTime);
			} else {
				setNextRoutineTime(null);
			}

			// Update current task
			const currentTask = await getCurrentTask(data);
			setCurrentTask(currentTask);

			if (currentTask) {
				const remainingTimeEndTask = await getRemainingTimeEndTask(currentTask);
				setRemainingTimeEndTask(remainingTimeEndTask);
				const progressTask = await getProgressTask(currentTask);
				setProgressTask(progressTask);
			} else {
				setRemainingTimeEndTask(null);
				setProgressTask(0);
			}
		};

		if (data) {
			fetchTimes();

			const intervalId = setInterval(fetchTimes, 1000);

			return () => clearInterval(intervalId);
		}
	}, [data]);

	if (error) {
		return (
			<View>
				<ThemedText>Migration error: {error.message}</ThemedText>
			</View>
		);
	}

	if (!success) {
		return (
			<View style={styles.center}>
				<ActivityIndicator color='#0031AC' size='large' />
			</View>
		);
	}
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				{data.length == 0 ? (
					<ThemedText style={styles.title}>No Routine Found. {"\n"}</ThemedText>
				) : currentTask ? (
					<>
						<ThemedText style={[styles.title, styles.important]}>{currentTask.name}</ThemedText>
						<ThemedText style={styles.subtitle}>{remainingTimeEndTask} left</ThemedText>
						<View style={{ alignItems: "center" }}>
							<CircularProgress
								activeStrokeColor={"#3700FF"}
								inActiveStrokeColor={"#ffffff"}
								progressValueStyle={{ fontSize: 20, fontWeight: "400", color: "white" }}
								value={progressTask}
								radius={65}
								duration={0}
								progressFormatter={(value: number) => {
									"worklet";
									return `${value.toFixed(0)} %`;
								}}
							/>
						</View>
					</>
				) : nextRoutineTime ? (
					<ThemedText style={styles.title}>
						Next Routine in <ThemedText style={styles.important}>{nextRoutineTime}</ThemedText>
					</ThemedText>
				) : (
					<ThemedText style={styles.title}>No Routine For Today.</ThemedText>
				)}
			</View>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.routines}>
				{data.map((routine) => {
					const timeRemaining =
						routineTimes.find((time) => time.id === routine.id)?.timeRemaining || "";

					return (
						<RoutineCard
							key={routine.id}
							id={routine.id}
							name={routine.name}
							timeRemaining={timeRemaining}
							enabled={routine.enabled}
						/>
					);
				})}
				{data.length == 0 && <NoRoutine />}
			</ScrollView>

			<Pressable
				style={({ pressed }) => [
					styles.addBtn,
					{ backgroundColor: pressed ? "#0036BF" : "#0031AC" },
				]}
				onPress={() => router.navigate("/routine")}
			>
				<PlusIcon />
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingBottom: 70,
		height: "100%",
	},
	center: {
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
	},
	header: {
		gap: 10,
		marginBottom: 30,
	},
	title: {
		fontSize: 25,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 20,
		textAlign: "center",
		marginBottom: 15,
	},
	important: {
		color: "#7199FF",
	},
	routines: {
		gap: 13,
		alignItems: "center",
	},
	addBtn: {
		position: "absolute",
		bottom: 10,
		right: 10,
		borderRadius: 100,
		aspectRatio: 1,
		padding: 17,
	},
});
