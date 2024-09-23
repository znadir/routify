import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import AddIcon from "@/assets/svg/add-icon.svg";
import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Switch, Pressable, Animated } from "react-native";

function TaskCard() {
	return (
		<View style={styles.taskCard}>
			<ThemedText style={styles.cardText}>École à 8h</ThemedText>
			<ThemedText style={styles.cardText}>6h08 à 6h33</ThemedText>
		</View>
	);
}

export default function Routine() {
	const [routineName, setRoutineName] = useState("Routine Name");
	const [taskName, setTaskName] = useState("Task Name");
	const [alarmSwitch, setAlarmSwitch] = useState(false);
	const toggleAlarmSwitch = () => setAlarmSwitch((previousState) => !previousState);

	const [modalVisible, setModalVisible] = useState(false);
	const modalAnim = useRef(new Animated.Value(300)).current;

	useEffect(() => {
		Animated.timing(modalAnim, {
			toValue: modalVisible ? 0 : 300, // Show modal at 0 when visible
			duration: 800,
			useNativeDriver: true,
		}).start();
	}, [modalVisible]);

	return (
		<View style={styles.container}>
			<ThemedTextInput
				onChangeText={(text) => setRoutineName(text)}
				value={routineName}
				placeholder={routineName}
				style={{ paddingHorizontal: 20 }}
			/>

			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? "#0f0f0f" : "#000000",
					},
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
				<TaskCard />

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

			<Animated.View style={[styles.bottomModal, { transform: [{ translateY: modalAnim }] }]}>
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
					<Pressable
						style={({ pressed }) => [
							styles.button,
							{ backgroundColor: pressed ? "#1f008f" : "#190075" },
						]}
					>
						<ThemedText>Add</ThemedText>
					</Pressable>
					<Pressable
						onPress={() => setModalVisible(false)}
						style={({ pressed }) => [
							styles.button,
							{ backgroundColor: pressed ? "#4d4d4d" : "#373737" },
						]}
					>
						<ThemedText>Cancel</ThemedText>
					</Pressable>
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
		padding: 20,
		backgroundColor: "#181818",
		borderRadius: 10,
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
	bottomModal: {
		position: "absolute",
		bottom: 0,
		width: "100%",
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
	button: {
		padding: 10,
		borderRadius: 10,
		flex: 1,
		backgroundColor: "#000000",
		alignItems: "center",
	},
});
