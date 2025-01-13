import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { OswaldText } from "../OswaldText";
import Icon from "react-native-vector-icons/FontAwesome";

const StarRatingDropdown = ({ label, selectedValue, onValueChange }) => {
  const [isVisible, setIsVisible] = useState(false);



  const renderStars = (numStars) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Icon
          key={`star-${i}`}
          name={i < numStars ? "star" : "star-o"}
          size={16}
        />
      );
    }
    return <View style={styles.stars}>{stars}</View>;
  };

  const handleSelect = (value) => {
    onValueChange(value);
    setIsVisible(false);
  };

  const options = [
    { value: 0, label: "--Select--" },
    { value: 1, label: renderStars(1) },
    { value: 2, label: renderStars(2) },
    { value: 3, label: renderStars(3) },
    { value: 4, label: renderStars(4) },
    { value: 5, label: renderStars(5) },
  ];

  return (
    <View>
      <OswaldText type="subtitle">{label}</OswaldText>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsVisible(true)}
      >
        <OswaldText style={styles.dropdownText}>
          {selectedValue === 0
            ? "--Select--"
            : renderStars(selectedValue)}
        </OswaldText>
      </TouchableOpacity>
      {isVisible && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  style={styles.option}
                >
                  {typeof option.label === "string" ? (
                    <OswaldText>{option.label}</OswaldText>
                  ) : (
                    option.label
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                style={styles.closeButton}
              >
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
    flexDirection: "row",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#DA583B",
    borderRadius: 5,
    alignItems: "center",
  },
  stars: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default StarRatingDropdown;
