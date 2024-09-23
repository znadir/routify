import { Pressable, type PressableProps, StyleSheet } from "react-native";

export default function ThemedText({ style, ...rest }: PressableProps) {
	return (
		<Pressable
			style={({ pressed }) => [
				styles.base,
				typeof style === "function" ? style({ pressed }) : style,
			]}
			{...rest}
		/>
	);
}

const styles = StyleSheet.create({
	base: {
		padding: 10,
		borderRadius: 10,
		backgroundColor: "#000000",
		alignItems: "center",
		justifyContent: "center",
	},
});
