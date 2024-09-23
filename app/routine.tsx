import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import AddIcon from "@/assets/svg/add-icon.svg";
import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Switch, Pressable, Animated, Easing, Keyboard } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Button from "@/components/Button";
import TrashIcon from "@/assets/svg/trash-icon.svg";

function TaskCard({ title, timeRange }: { title: string; timeRange: string }) {
	return (
		<View style={styles.taskCard}>
			<ThemedText style={styles.cardText}>{title}</ThemedText>
			<View style={styles.taskCardRight}>
				<ThemedText style={styles.cardText}>{timeRange}</ThemedText>
				<Button
					style={({ pressed }) => [
						styles.trashButton,
						{ backgroundColor: pressed ? "#3E3E3E" : "#313131" },
					]}
				>
					<TrashIcon />
				</Button>
			</View>
		</View>
	);
}

export default function Routine() {
	const [routineName, setRoutineName] = useState("");
	const [taskName, setTaskName] = useState("Task Name");
	const [alarmSwitch, setAlarmSwitch] = useState(false);
	const toggleAlarmSwitch = () => setAlarmSwitch((previousState) => !previousState);

	const [modalVisible, setModalVisible] = useState(false);
	const modalAnim = useRef(new Animated.Value(300)).current;

	useEffect(() => {
		Animated.timing(modalAnim, {
			toValue: modalVisible ? 0 : 300, // Show modal at 0 when visible
			duration: 900,
			easing: Easing.elastic(0),
			useNativeDriver: true,
		}).start();
	}, [modalVisible]);

	// const { routineId } = useLocalSearchParams<{ id?: string }>();

	const tasks = [
		{ title: "Manger", timeRange: "8h - 8h 30" },
		{ title: "Étudier", timeRange: "8h 30 - 9h 30" },
	];

	return (
		<View style={styles.container}>
			<View style={styles.topView}>
				<ThemedTextInput
					onChangeText={(text) => setRoutineName(text)}
					value={routineName}
					placeholder='Routine Name'
					style={styles.routineName}
					placeholderTextColor='#3d3d3d'
				/>
				<Button
					style={({ pressed }) => [
						styles.trashButton,
						{ backgroundColor: pressed ? "#7a0000" : "#680000" },
					]}
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
					<ThemedText style={styles.textItem}>Homecoming</ThemedText>
				</View>
				<Switch
					trackColor={{ false: "#767577", true: "#00b02f" }}
					thumbColor='#ffffff'
					ios_backgroundColor='#3e3e3e'
					onValueChange={toggleAlarmSwitch}
					value={alarmSwitch}
					style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
				/>
			</Pressable>

			<View style={styles.cardsContainer}>
				{tasks.map((task, i) => (
					<TaskCard key={i} title={task.title} timeRange={task.timeRange} />
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

			<Animated.View
				style={[styles.modal, styles.bottom, { transform: [{ translateY: modalAnim }] }]}
			>
				<ThemedTextInput
					onChangeText={(text) => setTaskName(text)}
					value={taskName}
					placeholder={taskName}
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
					<ThemedTextInput maxLength={2} style={styles.numberInput} />
					<ThemedText style={styles.modalText}>:</ThemedText>
					<ThemedTextInput maxLength={2} style={styles.numberInput} />
					<ThemedText style={styles.modalText}>to</ThemedText>
					<ThemedTextInput maxLength={2} style={styles.numberInput} />
					<ThemedText style={styles.modalText}>:</ThemedText>
					<ThemedTextInput maxLength={2} style={styles.numberInput} />
				</View>

				<View style={styles.buttons}>
					<Button
						style={({ pressed }) => [{ backgroundColor: pressed ? "#363A9A" : "#2B2F7C", flex: 1 }]}
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
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 20,
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
