import { Stack } from "expo-router";

export default function RootLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animation: "fade_from_bottom",
				contentStyle: {
					paddingTop: 80,
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
