import { TextInput, type TextInputProps, StyleSheet } from "react-native";

export default function ThemedTextInput({ style, ...rest }: TextInputProps) {
	return <TextInput placeholderTextColor='white' style={[styles.input, style]} {...rest} />;
}

const styles = StyleSheet.create({
	input: {
		borderBottomColor: "#323232",
		borderBottomWidth: 1,
		color: "white",
		padding: 10,
		fontSize: 20,
	},
});
