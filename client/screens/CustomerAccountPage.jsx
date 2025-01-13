import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { OswaldText } from "../assets/components/OswaldText";
import { ArialText } from "../assets/components/ArialText";
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrderHistoryCard from "../assets/components/OrderHistoryCard";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import CustomerAccountCard from "../assets/components/CustomerAccountCard";


export default function CustomerAccount() {

  return (
    <View style={styles.container}>
      <OswaldText type="subtitle" style={styles.headerContainer}>MY ACCOUNT</OswaldText>
      <CustomerAccountCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
    headerContainer: {
paddingLeft: 20,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: "#222126",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  column: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
    alignItems: "center",
  },
  header: {
    fontWeight: "bold",
    color: '#DA583B',
    fontSize: 18,
    fontWeight: 'regular',
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  closeButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});