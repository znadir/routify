import { Text, type TextProps } from "react-native";

export default function ThemedText({ style, ...rest }: TextProps) {
	return <Text style={[{ color: "white" }, style]} {...rest} />;
}
