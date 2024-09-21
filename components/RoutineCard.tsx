import { View, Image, Pressable } from "react-native";
import ThemedText from "./MyText";
import { StyleSheet, Switch } from "react-native";
import { useState } from "react";
import ShowLess from "../assets/svg/showless-btn.svg";
import ShowMore from "../assets/svg/showmore-btn.svg";

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

export default function RoutineCard({ currentTaskName, timeRemaining, tasks }: Routine) {
	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

	return (
		<View style={styles.container}>
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
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#161842",
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
