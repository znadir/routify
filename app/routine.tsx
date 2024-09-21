import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import { useState } from "react";
import { View, StyleSheet, TextInput, Switch, Pressable } from "react-native";

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
});
