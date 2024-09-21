import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function RootLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {
					paddingTop: 80,
					paddingBottom: 70,
					paddingHorizontal: 10,
					backgroundColor: "black",
				},
			}}
		>
			<Stack.Screen name='index' />
			<Stack.Screen name='routine' />
		</Stack>
	);
}
