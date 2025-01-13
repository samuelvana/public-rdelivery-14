import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { OswaldText } from "../assets/components/OswaldText";
import Icon from "react-native-vector-icons/FontAwesome";
import ProductCard from "../assets/components/ProductCard";
import OrderConfirmationCard from "../assets/components/OrderConfirmationCard"; // Import the OrderConfirmationCard

const imageMap = {
  Greek: require("../assets/images/restaurants/cuisineGreek.jpg"),
  Japanese: require("../assets/images/restaurants/cuisineJapanese.jpg"),
  Pasta: require("../assets/images/restaurants/cuisinePasta.jpg"),
  Pizza: require("../assets/images/restaurants/cuisinePizza.jpg"),
  Southeast: require("../assets/images/restaurants/cuisineSoutheast.jpg"),
  Viet: require("../assets/images/restaurants/cuisineViet.jpg"),
};

const RestaurantMenu = ({ route, appWidth, appHeight }) => {
  const { restaurantId } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);  

  // Fetch the restaurant details using the restaurantId
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/restaurants/${restaurantId}`
        );
        const data = await response.json();
        setRestaurant(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
        setLoading(false);
      }
    };

    // Fetch the products for the restaurant
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products?restaurant=${restaurantId}`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
    fetchRestaurant();
  }, [restaurantId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!restaurant) {
    return <Text>Restaurant not found</Text>;
  }

  const { name, price_range, rating } = restaurant;

  // Function to render price range as dollar signs
  const renderPriceRange = (priceRange) => {
    return "$".repeat(priceRange);
  };

  // Function to render stars based on the rating
  const renderStars = (rating) => {
    const maxRating = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={`full-${i}`} name="star" size={12}/>);
    }

    if (hasHalfStar) {
      stars.push(<Icon key="half" name="star-half-o" size={12}/>);
    }

    // Fill in the remaining empty stars
    for (let i = stars.length; i < maxRating; i++) {
      stars.push(<Icon key={`empty-${i}`} name="star-o" size={12}/>);
    }


    return stars;
  };

  // Get restaurant image based on its name (or fallback image)
  const restaurantImage =
    imageMap[name] || require("../assets/images/restaurants/cuisinePizza.jpg");

  // Handle selecting a product with a specified quantity
  const handleSelectProduct = (productId, quantity) => {
    setSelectedProducts((prevSelected) => {
      const productIndex = prevSelected.findIndex(
        (item) => item.id === productId
      );
      let updatedProducts;

      if (productIndex > -1) {
        updatedProducts = [...prevSelected];
        updatedProducts[productIndex].quantity = quantity;
      } else {
        const product = products.find((p) => p.id === productId);
        updatedProducts = [...prevSelected, { ...product, quantity }];
      }

      return updatedProducts;
    });
  };


  const isOrderReady = selectedProducts.some((product) => product.quantity > 0);

  return (
    <View style={styles.container}>
      <OswaldText type="subtitle">RESTAURANT MENU</OswaldText>

      <TouchableOpacity style={styles.card}>
        <View style={styles.detailsContainer}>
          <OswaldText style={styles.title}>{name}</OswaldText>
          <OswaldText type='main'>
            Price: {renderPriceRange(price_range)}
          </OswaldText>
          <OswaldText type='main'>
            Rating:
            <View style={styles.ratingContainer}>{renderStars(rating)}</View>
          </OswaldText>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              !isOrderReady && styles.disabledButton,
            ]}
            onPress={() => isOrderReady && setModalVisible(true)} // Show the modal only if order is ready
            disabled={!isOrderReady} // Disable the button if no products are selected
          >
            <OswaldText type="subtitle" style={styles.buttonText}>
              Create Order
            </OswaldText>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.productsContainer}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={handleSelectProduct} // Pass the onSelect handler to ProductCard
            />
          ))}
        </ScrollView>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <OrderConfirmationCard
            selectedProducts={selectedProducts}
            restaurantId={restaurantId}
            onClose={() => setModalVisible(false)}
            appWidth={appWidth}
                appHeight={appHeight}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    width: "100%",
    elevation: 5, // For Android
    marginBottom: 20,
  },
  detailsContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
  },
  productList: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: "#DA583B",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 20,
    alignItems: "center",
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  disabledButton: {
    backgroundColor: "#B0B0B0",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "regular",
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

export default RestaurantMenu;
