import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import ThemedText from "../components/ThemedText";
import RoutineCard from "@/components/RoutineCard";
import { setBackgroundColorAsync } from "expo-navigation-bar";
import CircularProgress from "react-native-circular-progress-indicator";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { routine } from "../db/schema";
import db from "../db/db";
import { Link, router } from "expo-router";
import PlusIcon from "@/assets/svg/plus-icon.svg";

export default function Index() {
	setBackgroundColorAsync("black");

	const { data } = useLiveQuery(db.select().from(routine));

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				{data.length == 0 ? (
					<ThemedText style={styles.title}>No Routines Found.</ThemedText>
				) : false ? (
					<ThemedText style={styles.title}>
						Next Routine in <ThemedText style={styles.important}>16h 10 min</ThemedText>
					</ThemedText>
				) : (
					<>
						<ThemedText style={[styles.title, styles.important]}>Déjeuner</ThemedText>
						<ThemedText style={styles.subtitle}>13 min 10 sec left</ThemedText>
						<View style={{ alignItems: "center" }}>
							<CircularProgress
								activeStrokeColor={"#3700FF"}
								inActiveStrokeColor={"#ffffff"}
								progressValueStyle={{ fontSize: 20, fontWeight: "400", color: "white" }}
								value={630}
								radius={65}
								duration={0}
								progressFormatter={(value: number) => {
									"worklet";
									const hours = Math.floor(value / 3600);
									const minutes = Math.floor((value % 3600) / 60);
									const seconds = Math.floor(value % 60);

									const pad = (num: any) => (num < 10 ? `0${num}` : num);

									return hours > 0
										? `${hours}:${pad(minutes)}:${pad(seconds)}`
										: minutes > 0
										? `${minutes}:${pad(seconds)}`
										: `${seconds}`;
								}}
							/>
						</View>
					</>
				)}
			</View>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.routines}>
				{data.map((routine) => (
					<RoutineCard
						key={routine.id}
						name={routine.name}
						timeRemaining='18 min 10 sec'
						tasks={[
							{ name: "Manger", timeRange: "8h - 8h 30" },
							{ name: "Étudier", timeRange: "8h 30 - 9h 30" },
						]}
					/>
				))}
			</ScrollView>

			<Pressable
				style={({ pressed }) => [
					styles.addBtn,
					{ backgroundColor: pressed ? "#0036BF" : "#0031AC" },
				]}
				onPress={() => router.navigate("routine")}
			>
				<PlusIcon />
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingBottom: 70,
		height: "100%",
	},
	header: {
		gap: 10,
		marginBottom: 30,
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
	},
	addBtn: {
		position: "absolute",
		bottom: 10,
		right: 10,
		borderRadius: 100,
		aspectRatio: 1,
		padding: 17,
	},
});
