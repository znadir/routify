import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import AddIcon from "@/assets/svg/add-icon.svg";
import { useState } from "react";
import { View, StyleSheet, Switch, Pressable } from "react-native";

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
	const [alarmSwitch, setAlarmSwitch] = useState(false);
	const toggleAlarmSwitch = () => setAlarmSwitch((previousState) => !previousState);

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

				<View style={styles.addCard}>
					<AddIcon />
					<ThemedText style={styles.cardText}>Add Task</ThemedText>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 20,
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
		backgroundColor: "#212121",
		borderRadius: 10,
		padding: 20,
		gap: 10,
	},
	cardText: {
		fontSize: 16,
	},
});
