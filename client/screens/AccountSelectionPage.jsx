import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import ParallaxScrollView from "../assets/components/ParallaxScrollView";
import { OswaldText } from '../assets/components/OswaldText';
import { ArialText } from "../assets/components/ArialText";
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const AccountSelectionPage = ({ route }) => {
  const navigation = useNavigation();
  const { userId } = route.params;

  const handleSelectCustomer = () => {
    navigation.navigate("Customers");
  };

  const handleSelectCourier = () => {
    navigation.navigate("Couriers");
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/AppLogoV2.png")}
          style={styles.logo}
        />

      </View>

      {/* Account Selection Cards */}
      <OswaldText style={styles.title}>Select Account Type</OswaldText>
      <View style={styles.cardContainer}>
        {/* Customer Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={handleSelectCustomer}
        >
          <FontAwesome5 name="user" size={100} color="#DA583B" />
          <ArialText style={styles.cardText}>Customer</ArialText>
        </TouchableOpacity>

        {/* Courier Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={handleSelectCourier}
        >
          <FontAwesome5 name="taxi" size={100} />
          <ArialText style={styles.cardText}>Courier</ArialText>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default AccountSelectionPage;


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
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },

  cardContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 10, // Reduced spacing between the logo and cards
  },
  card: {
    backgroundColor: "#F9F9F9",
    width: "35%",
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginLeft: 10,
    marginRight: 10,
  },
  cardText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#353636",
  },
});
