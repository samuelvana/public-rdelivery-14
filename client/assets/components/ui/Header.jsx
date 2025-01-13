import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { OswaldText } from "../OswaldText";

const Header = ({ onLogout, appWidth, appHeight }) => {
  return (
    <View style={[styles.header, { height: appHeight * 0.1, paddingHorizontal: appWidth * 0.05 }]}>
      <Image
        source={require("../../images/AppLogoV1.png")}
        style={[styles.logo, { width: appWidth * 0.6, height: appHeight * 0.06 }]}
      />
      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <OswaldText type="button">LOG OUT</OswaldText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  logo: {
    resizeMode: "contain",
  },
  button: {
    backgroundColor: "#DA583B",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
});

export default Header;
