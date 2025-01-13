import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { OswaldText } from "../OswaldText";

const CustomDropdown = ({ label, options, selectedValue, onValueChange }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (value) => {
    onValueChange(value);
    setIsVisible(false);
  };

  return (
    <View>
      <OswaldText type="subtitle">{label}</OswaldText>
      <TouchableOpacity style={styles.dropdown} onPress={() => setIsVisible(true)}>
        <OswaldText style={styles.dropdownText}>{selectedValue === 0 ? '--Select--' : options[selectedValue - 0].label}</OswaldText>
      </TouchableOpacity>
      {isVisible && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {options.map(option => (
                <TouchableOpacity key={option.value} onPress={() => handleSelect(option.value)} style={styles.option}>
                  <OswaldText>{option.label}</OswaldText>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.closeButton}>
                <OswaldText>Close</OswaldText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: "#DA583B",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 50,
    alignItems: "center",
  },
  dropdownText: {
    color: "#fff",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  option: {
    paddingVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#DA583B",
    borderRadius: 5,
    alignItems: "center",
  },
});

export default CustomDropdown;
