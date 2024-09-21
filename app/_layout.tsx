import { Stack } from "expo-router";

export default function RootLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {
					paddingTop: 80,
					backgroundColor: "black",
				},
			}}
		>
			<Stack.Screen name='index' />
			<Stack.Screen name='task' />
		</Stack>
	);
}
