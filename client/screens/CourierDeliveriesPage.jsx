import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { OswaldText } from "../assets/components/OswaldText";
import { ArialText } from "../assets/components/ArialText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import DeliveryDetailsCard from "../assets/components/DeliveryDetailsCard";

export default function CourierDeliveries({ navigation, route }) {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { appWidth, appHeight } = route.params;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          setUser({ id: userId });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/orders?type=courier&id=${user.id}`
          );
          const data = await response.json();

          if (response.ok) {
            setOrderData(data);
          } else {
            console.error("Error fetching orders:", data.error);
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [user]);

  const handleViewOrder = (orderId) => {
    const selectedOrderData = orderData.find((order) => order.id === orderId);
    setSelectedOrder(selectedOrderData);
    setModalVisible(true);
  };

  const handleStatusChange = async (orderId, currentStatus) => {
    const statusOrder = ["pending", "in progress", "delivered"];
    const currentStatusIndex = statusOrder.indexOf(currentStatus);
    const nextStatus =
      statusOrder[(currentStatusIndex + 1) % statusOrder.length];

    try {
      const response = await fetch(
        `http://localhost:8080/api/order/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      if (response.ok) {
        const updatedOrdersResponse = await fetch(
          `http://localhost:8080/api/orders?type=courier&id=${user.id}`
        );
        const updatedOrders = await updatedOrdersResponse.json();
        setOrderData(updatedOrders);
      } else {
        console.error("Error updating order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getButtonColor = (status) => {
    switch (status) {
      case "pending":
        return "#851919";
      case "in progress":
        return "#DA583B";
      case "delivered":
        return "#609475";
      default:
        return "#DA583B";
    }
  };

  const isButtonDisabled = (status) => status === "delivered";

  if (loading) {
    return (
      <View style={styles.container}>
        <OswaldText type="subtitle">MY DELIVERIES</OswaldText>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OswaldText type="subtitle">MY DELIVERIES</OswaldText>

      <View style={styles.tableHeader}>
        <ArialText type="main" style={styles.narrowHeader}>
          ORDER ID
        </ArialText>
        <ArialText type="main" style={styles.header}>
          ADDRESS
        </ArialText>
        <ArialText type="main" style={styles.header}>
          STATUS
        </ArialText>
        <ArialText type="main" style={styles.narrowHeader}>
          VIEW
        </ArialText>
      </View>

      {orderData.map((item) => {
        const streetAddress = item.customer_address.split(",")[0];
        const isDisabled = isButtonDisabled(item.status);

        return (
          <View style={styles.row} key={item.id}>
            <ArialText type="main" style={styles.narrowcolumn}>
              {item.id}
            </ArialText>
            <ArialText type="main" style={styles.column}>
              {streetAddress}
            </ArialText>
            <TouchableOpacity
              style={[
                styles.column,
                { backgroundColor: getButtonColor(item.status) },
                styles.statusButton,
                isDisabled && styles.disabledButton,
              ]}
              onPress={() =>
                !isDisabled && handleStatusChange(item.id, item.status)
              }
              disabled={isDisabled}
            >
              <OswaldText type="main" style={styles.statusButtonText}>
                {item.status.toUpperCase()}
              </OswaldText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleViewOrder(item.id)}
              style={styles.narrowcolumn}
            >
              <FontAwesome5 name="search-plus" size={20} color="#DA583B" />
            </TouchableOpacity>
          </View>
        );
      })}

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          {selectedOrder && (
            <DeliveryDetailsCard
              order={selectedOrder}
              onClose={() => setModalVisible(false)}
              appWidth={appWidth}
              appHeight={appHeight}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#222126",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  column: {
    flex: 2,
    fontSize: 14,
    textAlign: "center",
    alignItems: "center",
  },
  narrowcolumn: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
    alignItems: "center",
  },
  header: {
    flex: 2,
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    alignItems: "center",
  },
  narrowHeader: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    alignItems: "center",
  },
  statusButton: {
    padding: 5,
    borderRadius: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  statusButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
