import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { OswaldText } from "./OswaldText";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/FontAwesome";

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const formatCost = (cost) => {
  return `$${parseFloat(cost).toFixed(2)}`;
};

const calculateTotalCost = (products) => {
  return products.reduce((total, product) => {
    return total + parseFloat(product.total_cost) * product.quantity;
  }, 0);
};

const OrderHistoryCard = ({ order, onClose, appWidth, appHeight }) => {
  const [rating, setRating] = useState(order.rating || 0); // Initialize with the existing rating or 0 if unavailable
  const [message, setMessage] = useState(null);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const maxRating = 5;
  const totalCost = calculateTotalCost(order.products);

  const handleSubmitRating = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/order/${order.id}/rating`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating }),
        }
      );

      if (response.ok) {
        setMessage({
          text: "Your rating has been updated successfully.",
          type: "success",
        });
      } else {
        const errorData = await response.json();
        setMessage({
          text: "Failed to update rating.",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred while updating the rating.",
        type: "error",
      });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };
  const isDelivered = order.status.toLowerCase() === "delivered";

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Icon
            name={i <= rating ? "star" : "star-o"}
            size={24}
            color="#DA583B"
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const renderConfirmationMessage = () => {
    if (message) {
      const messageStyle = message.type === 'success' ? styles.successMessageText : styles.errorMessageText;

      return (
        <View style={[styles.messageContainer, styles[message.type]]}>
          <Icon
            name={message.type === 'success' ? 'check-circle' : 'times-circle'}
            size={20}
            color={message.type === 'success' ? '#609475' : '#851919'}
          />
        <Text style={[styles.messageText, messageStyle]}>{message.text}</Text>
        </View>
      );
    }
    return null;
  };

  useEffect(() => {
    if (rating !== 0) {
      setIsRatingSubmitted(false);
    }
  }, [rating]);

  return (
    <View
      style={[styles.overlay, { width: appWidth-30, height: appHeight-30}]}
      onStartShouldSetResponder={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.topRow}>
            <OswaldText type="subtitle" style={styles.subtitle}>
              {order.restaurant_name}
            </OswaldText>
            <TouchableOpacity onPress={onClose} style={{ paddingRight: 20 }}>
              <FontAwesome5 name="times" size={24} color="#DA583B" />
            </TouchableOpacity>
          </View>

          <OswaldText type="main" style={styles.label}>
            Order Date: {formatDate(order.timestamp)}
          </OswaldText>
          <OswaldText type="main" style={styles.label}>
            Status: {order.status.toUpperCase()}
          </OswaldText>
          <OswaldText type="main" style={styles.label}>
            Courier: {order.courier_name}
          </OswaldText>
        </View>
        <View style={styles.productRow}>
          <OswaldText type="main" style={styles.productName}>
            {order.products[0].product_name}
          </OswaldText>
          <OswaldText type="main" style={styles.quantity}>
            x {order.products[0].quantity}
          </OswaldText>
          <OswaldText type="main" style={styles.cost}>
            {formatCost(order.products[0].total_cost)}
          </OswaldText>
        </View>
        <View style={styles.totalRow}>
          <OswaldText type="subtitle" style={styles.total}>
            Total:{" "}
          </OswaldText>
          <OswaldText type="subtitle">{formatCost(totalCost)}</OswaldText>
        </View>
        {isDelivered ? (
          !isRatingSubmitted && (
            <View style={styles.ratingSection}>
              <OswaldText type="main" style={styles.ratingText}>
                How did you like your meal?
              </OswaldText>
              <View style={styles.starsContainer}>{renderStars()}</View>
              {!message && (

              <TouchableOpacity onPress={handleSubmitRating} style={styles.button}>
                <OswaldText type="button">SEND RATING</OswaldText>
              </TouchableOpacity>
              )}
            </View>
          )
        ) : (
          <OswaldText type="main" style={styles.notDelivered}>
            Ratings can only be added or updated once the order is delivered.
          </OswaldText>
        )}
        {renderConfirmationMessage()}
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
    paddingTop: 10,
    paddingLeft: 30,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productRow: {
    paddingTop: 10,
    paddingLeft: 30,
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
  },
  label: {
    color: "#fff",
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
    backgroundColor: "#DA583B",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
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
  ratingSection: {
    padding: 10,
    alignItems: "center",
  },
  notDelivered: {
    textAlign: "center",
    color: "#DA583B",
    padding: 10,
  },
  ratingText: {
    textAlign: "center",
    color: "#DA583B",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  messageContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  success: {
    backgroundColor: "#D4EDDA",
  },
  error: {
    backgroundColor: "#F8D7DA",

},
successMessageText: {
  color: '#609475',
},
errorMessageText: {
  color: '#851919',
},
});

export default OrderHistoryCard;
