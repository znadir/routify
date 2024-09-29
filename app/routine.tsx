import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import AddIcon from "@/assets/svg/add-icon.svg";
import { useEffect, useRef, useState } from "react";
import {
	View,
	StyleSheet,
	Switch,
	Pressable,
	Animated,
	Easing,
	Keyboard,
	Alert,
	ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Button from "@/components/Button";
import TrashIcon from "@/assets/svg/trash-icon.svg";
import { getTasks, timeRangeToString } from "@/utils/utils";
import Toast from "react-native-root-toast";
import { routineSchema, routineTaskSchema, taskSchema } from "../utils/schema";
import db from "../utils/db";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

function AddTaskModal({
	addTask,
	setModalVisible,
	modalVisible,
}: {
	addTask: Function;
	setModalVisible: Function;
	modalVisible: boolean;
}) {
	const modalAnim = useRef(new Animated.Value(300)).current;
	const [taskName, setTaskName] = useState("");
	const [startHour, setStartHour] = useState("08");
	const [startMinute, setStartMinute] = useState("30");
	const [endHour, setEndHour] = useState("10");
	const [endMinute, setEndMinute] = useState("00");

	useEffect(() => {
		Animated.timing(modalAnim, {
			toValue: modalVisible ? 0 : 300, // Show modal at 0 when visible
			duration: 900,
			easing: Easing.elastic(0),
			useNativeDriver: true,
		}).start();
	}, [modalVisible]);

	const addCallback = () => {
		try {
			addTask(taskName, startHour, startMinute, endHour, endMinute);
			setTaskName("");
		} catch (e: any) {
			Toast.show(e.toString(), {
				backgroundColor: "red",
				position: Toast.positions.CENTER,
			});
		}
	};

	return (
		<Animated.View
			style={[styles.bottom, styles.modal, { transform: [{ translateY: modalAnim }] }]}
		>
			<ThemedTextInput
				onChangeText={(text) => setTaskName(text)}
				value={taskName}
				placeholder='Task Name'
			/>

			<View
				style={{
					gap: 10,
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					paddingVertical: 20,
				}}
			>
				<ThemedTextInput
					value={startHour}
					onChangeText={setStartHour}
					keyboardType='numeric'
					maxLength={2}
					style={styles.numberInput}
				/>
				<ThemedText style={styles.modalText}>:</ThemedText>
				<ThemedTextInput
					value={startMinute}
					onChangeText={setStartMinute}
					keyboardType='numeric'
					maxLength={2}
					style={styles.numberInput}
				/>
				<ThemedText style={styles.modalText}>to</ThemedText>
				<ThemedTextInput
					value={endHour}
					onChangeText={setEndHour}
					keyboardType='numeric'
					maxLength={2}
					style={styles.numberInput}
				/>
				<ThemedText style={styles.modalText}>:</ThemedText>
				<ThemedTextInput
					value={endMinute}
					onChangeText={setEndMinute}
					keyboardType='numeric'
					maxLength={2}
					style={styles.numberInput}
				/>
			</View>

			<View style={styles.buttons}>
				<Button
					style={({ pressed }) => [{ backgroundColor: pressed ? "#363A9A" : "#2B2F7C", flex: 1 }]}
					onPress={addCallback}
				>
					<ThemedText>Add</ThemedText>
				</Button>
				<Button
					onPress={() => {
						Keyboard.dismiss();
						setModalVisible(false);
					}}
					style={({ pressed }) => [{ backgroundColor: pressed ? "#4d4d4d" : "#373737", flex: 1 }]}
				>
					<ThemedText>Cancel</ThemedText>
				</Button>
			</View>
		</Animated.View>
	);
}

function TaskCard({
	name,
	timeRange,
	onDelete,
}: {
	name: string;
	timeRange: string;
	onDelete: Function;
}) {
	return (
		<View style={styles.taskCard}>
			<ThemedText style={styles.cardText}>{name}</ThemedText>
			<View style={styles.taskCardRight}>
				<ThemedText style={styles.cardText}>{timeRange}</ThemedText>
				<Button
					style={({ pressed }) => [
						styles.trashButton,
						{ backgroundColor: pressed ? "#3E3E3E" : "#313131" },
					]}
					onPress={() => onDelete()}
				>
					<TrashIcon />
				</Button>
			</View>
		</View>
	);
}

interface Task {
	name: string;
	startDayMin: number;
	endDayMin: number;
}

export default function Routine() {
	const { routineId } = useLocalSearchParams<{ routineId?: string }>();

	const { data } = useLiveQuery(
		db
			.select()
			.from(routineSchema)
			.where(eq(routineSchema.id, routineId ? parseInt(routineId) : 0))
	);

	const [routineName, setRoutineName] = useState("");
	const alarmName = "Homecoming";
	const [enableAlarm, setEnableAlarm] = useState(false);
	const [tasks, setTasks] = useState<Task[]>([]);

	const toggleAlarmSwitch = () => setEnableAlarm((previousState) => !previousState);
	const [modalVisible, setModalVisible] = useState(false);

	useEffect(() => {
		async function syncRoutine() {
			if (routineId) {
				const tasks = await getTasks(parseInt(routineId));

				setRoutineName(data[0]?.name);
				setEnableAlarm(data[0]?.enableAlarm);
				setTasks(tasks);
			}
		}

		syncRoutine();
	}, [data]);

	const addTask = (
		taskName: string,
		startHour: string,
		startMinute: string,
		endHour: string,
		endMinute: string
	) => {
		// ensure all fields are numbers
		if (
			!taskName.match(/^\d+$/) &&
			!startHour.match(/^\d+$/) &&
			!startMinute.match(/^\d+$/) &&
			!endHour.match(/^\d+$/) &&
			!endMinute.match(/^\d+$/)
		) {
			throw new Error("All fields must be numbers");
		}

		if (
			parseInt(startHour) > 23 ||
			parseInt(startMinute) > 59 ||
			parseInt(endHour) > 23 ||
			parseInt(endMinute) > 59
		) {
			throw new Error("All fields must be within range");
		}

		const startDayMin = parseInt(startHour) * 60 + parseInt(startMinute);
		const endDayMin = parseInt(endHour) * 60 + parseInt(endMinute);

		if (taskName === "") {
			throw new Error("Task name cannot be empty");
		}

		if (startDayMin >= endDayMin) {
			throw new Error("Start day must be before end day");
		}

		// ensure there's no other task that overlaps with this one
		tasks.forEach((task) => {
			if (
				!(startDayMin < task.startDayMin && endDayMin < task.startDayMin) &&
				!(startDayMin > task.endDayMin && endDayMin > task.endDayMin)
			) {
				throw new Error("Task overlaps with another task");
			}
		});

		const newTasks = [...tasks, { name: taskName, startDayMin, endDayMin }];
		const sortedTasks = newTasks.sort((a, b) => a.startDayMin - b.startDayMin);
		setTasks(sortedTasks);
		setModalVisible(false);
	};

	const deleteRoutine = () => {
		const confirmDelete = async () => {
			if (routineId) {
				await db.delete(routineSchema).where(eq(routineSchema.id, parseInt(routineId)));
			}

			router.back();
		};
		Alert.alert("Delete Routine", "Are you sure you want to delete this routine?", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Delete",
				style: "destructive",
				onPress: () => confirmDelete(),
			},
		]);
	};

	const createTasks = (routineId: number) => {
		tasks.forEach(async (task) => {
			const taskId = await db
				.insert(taskSchema)
				.values({
					name: task.name,
					startDayMin: task.startDayMin,
					endDayMin: task.endDayMin,
				})
				.returning({ insertedId: taskSchema.id });

			await db.insert(routineTaskSchema).values({
				routineId: routineId,
				taskId: taskId[0].insertedId,
			});
		});
	};

	const createRoutine = async () => {
		const routines = await db
			.insert(routineSchema)
			.values({
				name: routineName,
				enabled: true,
				alarmName,
				enableAlarm,
			})
			.returning({ insertedId: routineSchema.id });

		const routineId = routines[0].insertedId;

		createTasks(routineId);

		router.back();
	};

	const saveRoutine = async () => {
		if (!routineId) {
			return;
		}

		// delete all routineTasks and tasks to recreate them
		const tasks = await getTasks(parseInt(routineId));

		tasks.forEach(async (task) => {
			await db.delete(taskSchema).where(eq(taskSchema.id, task.id));
		});

		await db.delete(routineTaskSchema).where(eq(routineTaskSchema.routineId, parseInt(routineId)));

		await createTasks(parseInt(routineId));

		await db
			.update(routineSchema)
			.set({ name: routineName, alarmName, enableAlarm })
			.where(eq(routineSchema.id, parseInt(routineId)));

		router.back();
	};

	if (data.length === 0 && routineId) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size='large' color='#7199FF' />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.topView}>
				<ThemedTextInput
					onChangeText={(text) => setRoutineName(text)}
					value={routineName}
					placeholder='Routine Name'
					style={styles.routineName}
				/>
				<Button
					style={({ pressed }) => [
						styles.trashButton,
						{ backgroundColor: pressed ? "#7a0000" : "#680000" },
					]}
					onPress={deleteRoutine}
				>
					<TrashIcon />
				</Button>
			</View>

			<Pressable
				style={({ pressed }) => [
					{ backgroundColor: pressed ? "#0f0f0f" : "#000000" },
					styles.alarmContainer,
				]}
			>
				<View style={styles.alarmLeft}>
					<ThemedText style={styles.textOption}>Alarm Sound</ThemedText>
					<ThemedText style={styles.textItem}>{alarmName}</ThemedText>
				</View>
				<Switch
					trackColor={{ false: "#767577", true: "#00b02f" }}
					thumbColor='#ffffff'
					ios_backgroundColor='#3e3e3e'
					onValueChange={toggleAlarmSwitch}
					value={enableAlarm}
					style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
				/>
			</Pressable>

			<View style={styles.cardsContainer}>
				{tasks.map((task, i) => (
					<TaskCard
						key={i}
						name={task.name}
						timeRange={timeRangeToString(task.startDayMin, task.endDayMin)}
						onDelete={() => {
							const newTasks = [...tasks];
							newTasks.splice(i, 1);
							setTasks(newTasks);
						}}
					/>
				))}

				<Pressable
					onPress={() => setModalVisible(true)}
					style={({ pressed }) => [
						styles.addCard,
						{ backgroundColor: pressed ? "#2b2b2b" : "#212121" },
					]}
				>
					<AddIcon />
					<ThemedText style={styles.cardText}>Add Task</ThemedText>
				</Pressable>
			</View>

			<View style={[styles.bottom, styles.buttons, { paddingBottom: 10 }]}>
				<Button
					onPress={() => {
						if (routineId) {
							saveRoutine();
						} else {
							createRoutine();
						}
					}}
					style={({ pressed }) => [{ backgroundColor: pressed ? "#278227" : "#237023", flex: 1 }]}
				>
					<ThemedText>Save</ThemedText>
				</Button>
				<Button
					onPress={() => router.back()}
					style={({ pressed }) => [{ backgroundColor: pressed ? "#4d4d4d" : "#373737", flex: 1 }]}
				>
					<ThemedText>Cancel</ThemedText>
				</Button>
			</View>

			<AddTaskModal
				addTask={addTask}
				setModalVisible={setModalVisible}
				modalVisible={modalVisible}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 20,
		height: "100%",
	},
	center: {
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
	},
	topView: {
		flexDirection: "row",
		gap: 10,
	},
	routineName: {
		paddingHorizontal: 20,
		flex: 1,
	},
	alarmContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
	},
	alarmLeft: {
		gap: 5,
	},
	textOption: {
		fontSize: 20,
	},
	textItem: {
		color: "#7199FF",
	},
	cardsContainer: {
		gap: 15,
	},
	taskCard: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#181818",
		borderRadius: 10,
	},
	taskCardRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 20,
	},
	addCard: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 10,
		padding: 20,
		gap: 10,
	},
	cardText: {
		fontSize: 16,
	},
	bottom: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		backgroundColor: "#000000",
		paddingTop: 10,
	},
	modal: {
		padding: 20,
		backgroundColor: "#242424",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		gap: 5,
	},
	modalText: {
		fontSize: 20,
	},
	numberInput: {
		width: 65,
		backgroundColor: "black",
		borderRadius: 5,
		textAlign: "center",
	},
	buttons: {
		flexDirection: "row",
		gap: 20,
	},
	trashButton: {
		aspectRatio: 1,
	},
});
