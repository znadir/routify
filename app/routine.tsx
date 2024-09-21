import ThemedTextInput from "@/components/ThemedTextInput";
import { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";

export default function Routine() {
	const [routineName, setRoutineName] = useState("Routine Name");
	return (
		<View>
			<ThemedTextInput
				onChangeText={(text) => setRoutineName(text)}
				value={routineName}
				placeholder={routineName}
			/>
		</View>
	);
}

const styles = StyleSheet.create({});
