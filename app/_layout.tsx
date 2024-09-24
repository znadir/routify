import { Stack } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";

export default function RootLayout() {
	return (
		<RootSiblingParent>
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
		</RootSiblingParent>
	);
}
