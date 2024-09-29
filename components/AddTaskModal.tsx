import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Keyboard, View, StyleSheet } from "react-native";
import Toast from "react-native-root-toast";
import ThemedTextInput from "./ThemedTextInput";
import ThemedText from "./ThemedText";
import Button from "@/components/Button";

export default function AddTaskModal({
	addTask,
	setModalVisible,
	modalVisible,
}: {
	addTask: Function;
	setModalVisible: Function;
	modalVisible: boolean;
}) {
	const modalAnim = useRef(new Animated.Value(300)).current;
	const [taskName, setTaskName] = useState("");
	const [startHour, setStartHour] = useState("08");
	const [startMinute, setStartMinute] = useState("30");
	const [endHour, setEndHour] = useState("10");
	const [endMinute, setEndMinute] = useState("00");

	useEffect(() => {
		Animated.timing(modalAnim, {
			toValue: modalVisible ? 0 : 300, // Show modal at 0 when visible
			duration: 900,
			easing: Easing.elastic(0),
			useNativeDriver: true,
		}).start();
	}, [modalVisible]);

	const addCallback = () => {
		try {
			addTask(taskName, startHour, startMinute, endHour, endMinute);
			setTaskName("");
		} catch (e: any) {
			Toast.show(e.toString(), {
				backgroundColor: "red",
				position: Toast.positions.CENTER,
			});
		}
	};

	return (
		<Animated.View
			style={[styles.bottom, styles.modal, { transform: [{ translateY: modalAnim }] }]}
		>
			<ThemedTextInput
				onChangeText={(text) => setTaskName(text)}
				value={taskName}
				placeholder='Task Name'
			/>

			<View
				style={{
					gap: 10,
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					paddingVertical: 20,
				}}
			>
				<ThemedTextInput
					value={startHour}
					onChangeText={setStartHour}
					keyboardType='numeric'
					maxLength={2}
					style={styles.numberInput}
				/>
				<ThemedText style={styles.modalText}>:</ThemedText>
				<ThemedTextInput
					value={startMinute}
					onChangeText={setStartMinute}
					keyboardType='numeric'
					maxLength={2}
					style={styles.numberInput}
				/>
				<ThemedText style={styles.modalText}>to</ThemedText>
				<ThemedTextInput
					value={endHour}
					onChangeText={setEndHour}
					keyboardType='numeric'
					maxLength={2}
					style={styles.numberInput}
				/>
				<ThemedText style={styles.modalText}>:</ThemedText>
				<ThemedTextInput
					value={endMinute}
					onChangeText={setEndMinute}
					keyboardType='numeric'
					maxLength={2}
					style={styles.numberInput}
				/>
			</View>

			<View style={styles.buttons}>
				<Button
					style={({ pressed }) => [{ backgroundColor: pressed ? "#363A9A" : "#2B2F7C", flex: 1 }]}
					onPress={addCallback}
				>
					<ThemedText>Add</ThemedText>
				</Button>
				<Button
					onPress={() => {
						Keyboard.dismiss();
						setModalVisible(false);
					}}
					style={({ pressed }) => [{ backgroundColor: pressed ? "#4d4d4d" : "#373737", flex: 1 }]}
				>
					<ThemedText>Cancel</ThemedText>
				</Button>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	bottom: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		backgroundColor: "#000000",
		paddingTop: 10,
	},
	numberInput: {
		width: 65,
		backgroundColor: "black",
		borderRadius: 5,
		textAlign: "center",
	},
	modal: {
		padding: 20,
		backgroundColor: "#242424",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		gap: 5,
	},
	modalText: {
		fontSize: 20,
	},
	buttons: {
		flexDirection: "row",
		gap: 20,
	},
});
