import { ScrollView, StyleSheet, View } from "react-native";
import ThemedText from "../components/MyText";
import RoutineCard from "@/components/RoutineCard";

export default function Index() {
	return (
		<View style={styles.container}>
			<ThemedText style={styles.title}>
				Next Routine in <ThemedText style={styles.important}>16h 10 min</ThemedText>
			</ThemedText>

			<ScrollView contentContainerStyle={styles.routines}>
				<RoutineCard
					currentTaskName='École a 8h'
					timeRemaining='18 min 10 sec'
					tasks={[
						{ name: "Manger", timeRange: "8h - 8h 30" },
						{ name: "Étudier", timeRange: "8h 30 - 9h 30" },
					]}
				/>
				<RoutineCard
					currentTaskName='École a 8h'
					timeRemaining='18 min 10 sec'
					tasks={[
						{ name: "Manger", timeRange: "8h - 8h 30" },
						{ name: "Étudier", timeRange: "8h 30 - 9h 30" },
					]}
				/>
				<RoutineCard
					currentTaskName='École a 8h'
					timeRemaining='18 min 10 sec'
					tasks={[
						{ name: "Manger", timeRange: "8h - 8h 30" },
						{ name: "Étudier", timeRange: "8h 30 - 9h 30" },
					]}
				/>
				<RoutineCard
					currentTaskName='École a 8h'
					timeRemaining='18 min 10 sec'
					tasks={[
						{ name: "Manger", timeRange: "8h - 8h 30" },
						{ name: "Étudier", timeRange: "8h 30 - 9h 30" },
					]}
				/>
				<RoutineCard
					currentTaskName='École a 8h'
					timeRemaining='18 min 10 sec'
					tasks={[
						{ name: "Manger", timeRange: "8h - 8h 30" },
						{ name: "Étudier", timeRange: "8h 30 - 9h 30" },
					]}
				/>
				<RoutineCard
					currentTaskName='École a 8h'
					timeRemaining='18 min 10 sec'
					tasks={[
						{ name: "Manger", timeRange: "8h - 8h 30" },
						{ name: "Étudier", timeRange: "8h 30 - 9h 30" },
					]}
				/>
				<RoutineCard
					currentTaskName='École a 8h'
					timeRemaining='18 min 10 sec'
					tasks={[
						{ name: "Manger", timeRange: "8h - 8h 30" },
						{ name: "Étudier", timeRange: "8h 30 - 9h 30" },
					]}
				/>
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
		paddingLeft: 10,
		paddingRight: 10,
	},
	title: {
		fontSize: 25,
		marginBottom: 30,
		textAlign: "center",
	},
	important: {
		color: "#7199FF",
	},
	routines: {
		gap: 13,
	},
});
