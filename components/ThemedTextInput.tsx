import { TextInput, type TextInputProps, StyleSheet } from "react-native";

export default function ThemedTextInput({ style, ...rest }: TextInputProps) {
	return <TextInput placeholderTextColor='white' style={styles.input} {...rest} />;
}

const styles = StyleSheet.create({
	input: {
		borderBottomColor: "#FFFFFF",
		borderBottomWidth: 1,
		color: "white",
		padding: 10,
		fontSize: 25,
	},
});
