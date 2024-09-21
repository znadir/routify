import { View, Image, Pressable } from "react-native";
import ThemedText from "./ThemedText";
import { StyleSheet, Switch } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

interface Routine {
	currentTaskName: string;
	timeRemaining: string;
	tasks: Task[];
}

interface Task {
	name: string;
	timeRange: string;
}

function Task({ name, timeRange }: Task) {
	return (
		<View style={styles.task}>
			<ThemedText>{name}</ThemedText>
			<ThemedText>{timeRange}</ThemedText>
		</View>
	);
}

export default function RoutineCard({ currentTaskName, timeRemaining }: Routine) {
	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

	return (
		<Pressable
			style={({ pressed }) => [
				{ backgroundColor: pressed ? "#191c4f" : "#161842" },
				styles.container,
			]}
			onPress={(e) => router.push("/routine")}
		>
			<ThemedText style={styles.routineTitle}>{currentTaskName}</ThemedText>
			<View style={styles.routineRight}>
				<ThemedText>in {timeRemaining}</ThemedText>
				<Switch
					trackColor={{ false: "#767577", true: "#00b02f" }}
					thumbColor='#ffffff'
					ios_backgroundColor='#3e3e3e'
					onValueChange={toggleSwitch}
					value={isEnabled}
					style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
				/>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 12,
		paddingTop: 20,
		paddingBottom: 25,
		paddingHorizontal: 20,
		fontSize: 5,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	routineTitle: {
		fontSize: 20,
	},
	routineRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	tasks: {
		marginTop: 15,
		gap: 5,
	},
	task: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
});
