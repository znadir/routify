import { ScrollView, StyleSheet, View } from "react-native";
import ThemedText from "../components/ThemedText";
import RoutineCard from "@/components/RoutineCard";
import { setBackgroundColorAsync } from "expo-navigation-bar";
import CircularProgress from "react-native-circular-progress-indicator";

export default function Index() {
	setBackgroundColorAsync("black");

	return (
		<View style={styles.container}>
			{false ? (
				<ThemedText style={styles.title}>
					Next Routine in <ThemedText style={styles.important}>16h 10 min</ThemedText>
				</ThemedText>
			) : (
				<View style={styles.header}>
					<ThemedText style={[styles.title, styles.important]}>Déjeuner</ThemedText>
					<ThemedText style={styles.subtitle}>13 min 10 sec left</ThemedText>
					<View style={{ alignItems: "center" }}>
						<CircularProgress
							activeStrokeColor={"#ffffff"}
							inActiveStrokeColor={"#3700FF"}
							progressValueStyle={{ fontSize: 20, fontWeight: "400", color: "white" }}
							value={25}
							progressFormatter={(value: number) => {
								"worklet";

								return "10:30";
							}}
						/>
					</View>
				</View>
			)}

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.routines}>
				<RoutineCard
					currentTaskName='École a 8h'
					timeRemaining='18 min 10 sec'
					tasks={[
						{ name: "Manger", timeRange: "8h - 8h 30" },
						{ name: "Étudier", timeRange: "8h 30 - 9h 30" },
					]}
				/>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingBottom: 70,
	},
	header: {
		gap: 10,
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
		marginTop: 30,
	},
});
