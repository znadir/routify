import { View, Pressable, StyleSheet, Switch } from "react-native";
import ThemedText from "./ThemedText";
import { useState } from "react";
import { router } from "expo-router";
import db from "../utils/db";
import { routineSchema } from "../utils/schema";
import { eq } from "drizzle-orm";

interface Routine {
	id: number;
	name: string;
	timeRemaining: string;
	enabled: boolean;
}

export default function RoutineCard({ id, name, timeRemaining, enabled }: Routine) {
	const [isEnabled, setIsEnabled] = useState(enabled);
	const toggleSwitch = async () => {
		setIsEnabled((previousState) => !previousState);

		await db.update(routineSchema).set({ enabled: isEnabled }).where(eq(routineSchema.id, id));
	};

	return (
		<Pressable
			style={({ pressed }) => [
				{ backgroundColor: pressed ? "#191c4f" : "#161842" },
				styles.container,
			]}
			onPress={(e) => router.navigate("/routine")}
		>
			<ThemedText style={styles.routineTitle}>{name}</ThemedText>
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
		width: "100%",
	},
	routineTitle: {
		fontSize: 20,
	},
	routineRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
});
