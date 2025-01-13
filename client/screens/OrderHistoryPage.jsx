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
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrderHistoryCard from "../assets/components/OrderHistoryCard";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";


export default function OrderHistory({ navigation, route }) {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { appWidth, appHeight } = route.params;

    // Fetch user data from AsyncStorage
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
  

  // Fetch orders when user data is available
  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/orders?type=customer&id=${user.id}`
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

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <OswaldText type='main' style={styles.column}>{item.restaurant_name}</OswaldText>
      <OswaldText type='main' style={styles.column}>{item.status.toUpperCase()}</OswaldText>
      <TouchableOpacity onPress={() => handleViewOrder(item.id)} style={styles.column}>
        <FontAwesome5 name="search-plus" size={20} color="#DA583B" />
    </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <OswaldText type="subtitle">MY ORDERS</OswaldText>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OswaldText type="subtitle">MY ORDERS</OswaldText>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <OswaldText type="subtitle" style={[styles.column, styles.header]}>Restaurant</OswaldText>
        <OswaldText type="subtitle" style={[styles.column, styles.header]}>Status</OswaldText>
        <OswaldText type="subtitle" style={[styles.column, styles.header]}>View</OswaldText>
      </View>

      {/* Orders List */}
      <FlatList
        data={orderData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      {/* Modal for Order History Card */}
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          {selectedOrder && (
            <OrderHistoryCard order={selectedOrder} 
            onClose={() => setModalVisible(false)}
            appWidth={appWidth}
            appHeight={appHeight}/>
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
