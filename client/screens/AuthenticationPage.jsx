import React from "react";
import { View, StyleSheet, Image } from "react-native";
import LoginCard from "../assets/components/LoginCard";
import ParallaxScrollView from "../assets/components/ParallaxScrollView";

export default function LoginScreen() {
  return (
    <ParallaxScrollView
      style={styles.container}
      headerBackgroundColor={{ light: "#FFF", dark: "#353636" }}
      headerImage={
        <View style={styles.logoContainer}>
          <Image source={require("../assets/images/AppLogoV2.png")} style={styles.logo} />
        </View>
      }
    >
      <View>
        <LoginCard />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "80%",
    height: "60%",
    resizeMode: "contain",
  },
});
