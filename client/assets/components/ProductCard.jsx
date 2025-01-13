import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { OswaldText } from "./OswaldText";

const ProductCard = ({ product, onSelect }) => {
    const [quantity, setQuantity] = useState(0);
  
    const handleIncrease = () => {
      setQuantity(quantity + 1);
      onSelect(product.id, quantity + 1);
    };
  
    const handleDecrease = () => {
      if (quantity > 0) {
        setQuantity(quantity - 1);
        onSelect(product.id, quantity - 1);
      }
    };

    const formatCost = (cost) => {
        return `$${parseFloat(cost).toFixed(2)}`;
      };

  const productImage = {
        image: require('../images/restaurants/cuisinePizza.jpg'),
      };

      return (
        <View style={styles.card}>
          <View style={styles.productRow}>
            <Image source={productImage.image} style={styles.productImage} />
    
            <View style={styles.productInfo}>
              <OswaldText type='subtitle'>{product.name}</OswaldText>
              <OswaldText type='main' style={styles.productCost}>{formatCost(product.cost)}</OswaldText>
              <Text style={styles.productDescription}>{product.description}</Text>
            </View>
    
            <View style={styles.quantityControl}>
              <TouchableOpacity style={styles.button} onPress={handleDecrease}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <OswaldText type='main' style={styles.quantityText}>{quantity}</OswaldText>
              <TouchableOpacity style={styles.button} onPress={handleIncrease}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    elevation: 5, // For Android
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
        productImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 15,
      },
  productInfo: {
    flex: 1,
  },
  productCost: {
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 14,
    color: "#555",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  button: {
    width: 20,
    height: 20,
    backgroundColor: "#222126",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
color: "#fff",
paddingBottom: 2.5,
  },
  quantityText: {
    marginHorizontal: 25,
  },
});

export default ProductCard;
