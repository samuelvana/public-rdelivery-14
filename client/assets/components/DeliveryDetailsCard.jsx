import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { OswaldText } from "./OswaldText";
import { ArialText } from "./ArialText";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const formatCost = (cost) => {
  return `$${parseFloat(cost).toFixed(2)}`;
};

const calculateTotalCost = (products) => {
  return products.reduce((total, product) => {
    return total + product.quantity * product.total_cost;
  }, 0);
};


const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const DeliveryDetailsCard = ({ order, onClose, appWidth, appHeight }) => {
  const totalCost = calculateTotalCost(order.products);

  const handleModalClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <View style={[styles.overlay, { width: appWidth-30, height: appHeight-30}]} onStartShouldSetResponder={handleModalClose}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.topRow}>
            <OswaldText type="subtitle" style={styles.subtitle}>
              DELIVERY DETAILS
            </OswaldText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome5 name="times" size={24} color="#DA583B" />
            </TouchableOpacity>
          </View>
          <ArialText type="main" style={styles.label}>
            Status: {order.status.toUpperCase()}
          </ArialText>
        </View>
        <View style={styles.deliveryDetails}>
          <ArialText type="main" style={styles.main}>
            Delivery Address: {order.customer_address}
          </ArialText>
          <ArialText type="main" style={styles.main}>
            Restaurant: {order.restaurant_name}
          </ArialText>
          <ArialText type="main" style={styles.main}>
            Order Date: {formatDate(order.timestamp)}
          </ArialText>
        </View>

<View style={styles.productContainer}>
        <OswaldText type="main">Order Details:</OswaldText>
        <View style={styles.productRow}>
          <ArialText type="main" style={styles.productName}>
            {order.products[0].product_name}
          </ArialText>
          <ArialText type="main" style={styles.quantity}>
            x {order.products[0].quantity}
          </ArialText>
          <ArialText type="main" style={styles.cost}>
            {formatCost(order.products[0].total_cost)}
          </ArialText>
        </View>
        <View style={styles.totalRow}>
          <ArialText type="subtitle" style={styles.total}>
            Total:{" "}
          </ArialText>
          <ArialText type="subtitle">{formatCost(totalCost)}</ArialText>
        </View>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
  },
  card: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android
  },
  header: {
    paddingTop: 20,
    paddingLeft: 30,
    paddingBottom: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: "#222126",
  },
  main: {
    fontSize: 14,
    padding: 2.5,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    right: 20,
  },
  closeButton: {
    position: "absolute",
    right: 20,
  },
  deliveryDetails: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingBottom: 15,
  },
  productContainer: {
    paddingLeft: 20,
  },
  productRow: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 3,
    borderBottomColor: "#f0f0f0",
  },
  productName: {
    flex: 2,
    textAlign: "left",
  },
  quantity: {
    flex: 1,
    textAlign: "left",
  },
  cost: {
    flex: 1,
    fontSize: 16,
    paddingRight: 20,
    textAlign: "right",
  },
  total: {
    fontWeight: "bold",
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingRight: 20,
    justifyContent: "right",
  },
  title: {
    color: "#DA583B",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: "#DA583B",
    marginBottom: 5,
    textAlign: "center",
  },
  label: {
    color: "#fff",
    textAlign: "center",
    marginRight: 30,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontFamily: "oswald-regular",
  },
  button: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
});

export default DeliveryDetailsCard;
