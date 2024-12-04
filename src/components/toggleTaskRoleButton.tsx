import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import CustomText from "./customText";

interface ToggleButton {
  label: string;
  isActive: boolean;
}

interface ToggleGroupProps {
  buttons: string[]; // Array of button labels
  onChange: (states: { [key: string]: boolean }) => void; // Callback for all states
}

const ToggleTaskRoleButton: React.FC<ToggleGroupProps> = ({ buttons, onChange }) => {
  const [buttonStates, setButtonStates] = useState<{ [key: string]: boolean }>(
    buttons.reduce((acc, button, index) => ({ ...acc, [button]: index === 0 }), {})
  );

  const toggleButton = (label: string) => {
    const activeButtons = Object.values(buttonStates).filter((state) => state).length;

    // If there's only one active button, prevent it from being toggled off
    if (activeButtons === 1 && buttonStates[label]) {
      return;
    }

    const newStates = { ...buttonStates, [label]: !buttonStates[label] };
    setButtonStates(newStates);
    onChange(newStates);
  };

  return (
    <View style={styles.container}>
      {buttons.map((label) => (
        <TouchableOpacity
          key={label}
          style={[
            styles.button,
            buttonStates[label] && styles.activeButton, // Apply active styles
          ]}
          onPress={() => toggleButton(label)}
        >
          <CustomText type="normal" size={12}>
            {label}
          </CustomText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#f4f4f4",
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#d1e7dd",
    borderWidth: 1,
    borderColor: "#0f5132",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  activeButtonText: {
    color: "#0f5132",
  },
});

export default ToggleTaskRoleButton;
