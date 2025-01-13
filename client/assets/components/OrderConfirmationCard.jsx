import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  CheckBox,
} from "react-native";
import { OswaldText } from "./OswaldText";
import { ArialText } from "./ArialText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function OrderConfirmationCard({
  selectedProducts,
  restaurantId,
  onClose,
  appWidth,
  appHeight
}) {
  const [user, setUser] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [sendSMS, setSendSMS] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");

        if (userId) {
          setUser({ id: userId });
        }
      } catch (error) {
        console.error("Error retrieving user data from AsyncStorage:", error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    if (orderConfirmed) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [orderConfirmed, onClose]);

  const calculateTotalCost = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.cost * product.quantity,
      0
    );
  };

  const confirmOrder = async () => {
    if (!user) {
      Alert.alert("Error", "User data is not loaded.");
      return;
    }

    const orderData = {
      restaurant_id: restaurantId,
      customer_id: user.id,
      products: selectedProducts.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      })),
      sendSMS,
      sendEmail,
    };

    setLoading(true);
    setError(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        // Order successfully created
        setOrderConfirmed(true); // Set confirmation state to true
        // Alert.alert('Order Confirmed', `Order ID: ${data.order_id}`); // Show alert for order ID if needed
      } else {
        // Alert.alert('Error', data.message || 'An error occurred while placing the order.');
        setError(true);
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      setError(true);
      // Alert.alert('Error', 'An error occurred while trying to confirm the order.');
    } finally {
      setLoading(false);
    }
  };

  const formatCost = (cost) => {
    return `$${parseFloat(cost).toFixed(2)}`;
  };

  const handleModalClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose(); // Close the modal if the background is clicked
    }
  };

  return (
    <View style={[styles.overlay, { width: appWidth-30, height: appHeight-30}]} onStartShouldSetResponder={handleModalClose}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <OswaldText style={styles.title}>Order Confirmation</OswaldText>
          <TouchableOpacity onPress={onClose} style={{ paddingRight: 20 }}>
            <FontAwesome5 name="times" size={24} color="#DA583B" />
          </TouchableOpacity>
        </View>

        <OswaldText type="main" style={styles.label}>
          Order Summary
        </OswaldText>
        <ScrollView style={styles.scrollContainer}>
          {selectedProducts.length > 0 ? (
            selectedProducts.map((product) => (
              <View key={product.id} style={styles.productRow}>
                <OswaldText type="main" style={styles.productName}>
                  {product.name}
                </OswaldText>
                <OswaldText type="main" style={styles.quantity}>
                  x {product.quantity}
                </OswaldText>
                <OswaldText type="main" style={styles.cost}>
                  {formatCost(product.cost)}
                </OswaldText>
              </View>
            ))
          ) : (
            <Text>No products selected</Text>
          )}
        </ScrollView>
        <View style={styles.totalRow}>
          <OswaldText type="subtitle" style={styles.total}>
            Total:{" "}
          </OswaldText>
          <OswaldText type="subtitle">
            {formatCost(calculateTotalCost())}
          </OswaldText>
        </View>
        <View style={styles.checkboxSection}>
  <ArialText type="main" style={styles.confirmationMessage}>
    Would you like to receive your order confirmation by email and/or text?
  </ArialText>
  <View style={styles.checkboxContainer}>
    <View style={styles.checkboxItem}>
      <CheckBox value={sendEmail} onValueChange={setSendEmail} />
      <ArialText type="main"> By Email</ArialText>
    </View>
    <View style={styles.checkboxItem}>
      <CheckBox value={sendSMS} onValueChange={setSendSMS} />
      <ArialText type="main"> By Phone</ArialText>
    </View>
  </View>
</View>
        {loading ? (
          <View style={styles.confirmationContainer}>
            <ActivityIndicator size="large" color="#DA583B" />
            <OswaldText type="subtitle">Processing...</OswaldText>
          </View>
        ) : orderConfirmed ? ( // Conditionally render based on order confirmation
          <View style={styles.confirmationContainer}>
            <Icon name="check-circle" size={50} color="green" />
            <OswaldText type="subtitle">Thank You!</OswaldText>
            <OswaldText type="main">Your order has been received.</OswaldText>
          </View>
        ) : error ? (
          <View>
            <TouchableOpacity style={styles.button} onPress={confirmOrder}>
              <OswaldText type="subtitle" style={styles.buttonText}>
                CONFIRM ORDER
              </OswaldText>
            </TouchableOpacity>
            <View style={styles.confirmationContainer}>
              <Icon name="times-circle" size={50} color="red" />
              <OswaldText type="subtitle" style={{ color: "red" }}>
                Order Failed
              </OswaldText>
              <OswaldText type="main">
                Your order was not processed successfully. Please try again.
              </OswaldText>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={confirmOrder}>
            <OswaldText type="subtitle" style={styles.buttonText}>
              CONFIRM ORDER
            </OswaldText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

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
    elevation: 5,
  },
  title: {
    fontSize: 24,
    color: "#DA583B",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    paddingLeft: 10,
    paddingBottom: 15,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: "#222126",
  },
  label: {
    paddingTop: 15,
    paddingLeft: 10,
    fontWeight: "bold",
  },
  scrollContainer: {
    maxHeight: 200,
    marginBottom: 10,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  productName: {
    paddingLeft: 10,
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
    paddingRight: 20,
    justifyContent: "right",
  },
  productText: {
    fontSize: 16,
    color: "#888",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#DA583B",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "regular",
  },
  confirmationContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },
  confirmationMessage: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  
  checkboxSection: {
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderTopWidth: 3,
    borderTopColor: "#f0f0f0",
    paddingTop: 10,
  },
  
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
});
